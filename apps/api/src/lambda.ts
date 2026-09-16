import { SQSEvent, Context } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SqsConsumerService } from './modules/queue/sqs-consumer.service';

const logger = new Logger('AWSLambdaHandler');
let cachedAppContext: INestApplicationContext | null = null;

async function bootstrapAppContext(): Promise<INestApplicationContext> {
  if (!cachedAppContext) {
    logger.log('Bootstrapping NestJS Application Context for Lambda...');
    cachedAppContext = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'],
    });
    logger.log('NestJS Application Context bootstrapped successfully');
  }
  return cachedAppContext;
}

/**
 * AWS Lambda handler triggered by SQS Event Source Mapping.
 * Scales to zero when idle; boots or reuses warm container when jobs arrive.
 */
export const handler = async (event: SQSEvent, context: Context): Promise<void> => {
  context.callbackWaitsForEmptyEventLoop = false;

  const appContext = await bootstrapAppContext();
  const sqsConsumer = appContext.get(SqsConsumerService);

  logger.log(`Received SQS event with ${event.Records?.length || 0} record(s)`);

  for (const record of event.Records) {
    try {
      await sqsConsumer.processRecord(record);
    } catch (error: any) {
      logger.error(`Error processing record ${record.messageId}: ${error.message}`, error.stack);
      // Re-throw so SQS can handle retry / dead letter queue as configured in AWS
      throw error;
    }
  }
};
