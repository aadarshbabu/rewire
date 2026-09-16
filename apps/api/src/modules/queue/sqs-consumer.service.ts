import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { AgentService } from '../agent/agent.service';
import { AiJobPayload } from '@rewire/types';

@Injectable()
export class SqsConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsConsumerService.name);
  private sqsClient: SQSClient | null = null;
  private queueUrl: string | null = null;
  private isPolling = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly agentService: AgentService,
  ) {}

  onModuleInit() {
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.queueUrl = this.configService.get<string>('AWS_SQS_QUEUE_URL') || null;

    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    const clientConfig: any = { region };
    if (accessKeyId && secretAccessKey) {
      clientConfig.credentials = { accessKeyId, secretAccessKey };
    }

    try {
      this.sqsClient = new SQSClient(clientConfig);
      this.logger.log(`Initialized AWS SDK v3 SQSClient for region: ${region}`);
    } catch (error) {
      this.logger.error('Failed to initialize AWS SQS Client', error);
    }
  }

  /**
   * Process a single SQS message body (used by both Lambda handler and local poller).
   */
  async processMessageBody(body: string): Promise<void> {
    let payload: AiJobPayload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      this.logger.error(`Failed to parse SQS message body as JSON: ${body}`, error);
      return;
    }

    if (!payload.runId || !payload.conversationId) {
      this.logger.error(`Invalid SQS message payload: missing runId or conversationId`, payload);
      return;
    }

    await this.agentService.processAiJob(payload);
  }

  /**
   * Process an SQS record received from an AWS Lambda event trigger.
   */
  async processRecord(record: { body: string; messageId?: string }): Promise<void> {
    this.logger.log(`Processing SQS record: ${record.messageId || 'unknown'}`);
    await this.processMessageBody(record.body);
  }

  /**
   * Starts a continuous polling loop for local development outside AWS Lambda.
   */
  async startLocalPoller(): Promise<void> {
    if (!this.sqsClient || !this.queueUrl) {
      this.logger.warn('AWS SQS Client or AWS_SQS_QUEUE_URL not configured. Local polling disabled.');
      return;
    }

    this.isPolling = true;
    this.logger.log(`Starting local SQS poller for queue: ${this.queueUrl}`);

    while (this.isPolling) {
      try {
        const response = await this.sqsClient.send(
          new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10,
            VisibilityTimeout: 60,
          }),
        );

        if (response.Messages && response.Messages.length > 0) {
          for (const message of response.Messages) {
            try {
              if (message.Body) {
                await this.processMessageBody(message.Body);
              }
            } catch (err: any) {
              this.logger.error(`Error processing SQS message: ${err.message}`, err.stack);
            } finally {
              if (message.ReceiptHandle) {
                try {
                  await this.sqsClient.send(
                    new DeleteMessageCommand({
                      QueueUrl: this.queueUrl,
                      ReceiptHandle: message.ReceiptHandle,
                    }),
                  );
                } catch (delErr: any) {
                  this.logger.error(`Failed to delete SQS message: ${delErr.message}`);
                }
              }
            }
          }
        }
      } catch (error: any) {
        if (!this.isPolling) break;
        this.logger.error(`Error during SQS poll: ${error.message}`);
        // Brief backoff before next poll
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
  }

  stopLocalPoller(): void {
    this.isPolling = false;
    this.logger.log('Stopped local SQS poller');
  }

  async onModuleDestroy() {
    this.stopLocalPoller();
    if (this.sqsClient) {
      this.sqsClient.destroy();
      this.logger.log('Destroyed AWS SQS Client');
    }
  }
}
