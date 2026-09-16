import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { AiJobPayload } from "@rewire/types";

const globalForSqs = globalThis as unknown as {
  sqsClient?: SQSClient;
};

export function getSqsClient(): SQSClient | null {
  const region = process.env.AWS_REGION || "ap-south-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (globalForSqs.sqsClient) {
    return globalForSqs.sqsClient;
  }

  const clientConfig: any = { region };
  if (accessKeyId && secretAccessKey) {
    clientConfig.credentials = { accessKeyId, secretAccessKey };
  }

  try {
    const client = new SQSClient(clientConfig);
    if (process.env.NODE_ENV !== "production") {
      globalForSqs.sqsClient = client;
    }
    return client;
  } catch (err: any) {
    console.error("[SQS] Failed to initialize SQSClient:", err.message);
    return null;
  }
}

/**
 * Dispatches an AI job to the AWS SQS queue.
 * Follows the lightweight identifier payload rule from architecture:
 * { runId, conversationId, messageId, userId }
 */
export async function enqueueAiJob(payload: AiJobPayload): Promise<{ success: boolean; messageId?: string }> {
  const queueUrl = process.env.AWS_SQS_QUEUE_URL;

  if (!queueUrl) {
    console.warn(
      `[SQS] AWS_SQS_QUEUE_URL is not configured. AI job ${payload.runId} was not dispatched to SQS. (Development mode)`
    );
    return { success: false };
  }

  const client = getSqsClient();
  if (!client) {
    console.error(`[SQS] SQSClient is unavailable for runId: ${payload.runId}`);
    return { success: false };
  }

  try {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
      MessageAttributes: {
        runId: {
          DataType: "String",
          StringValue: payload.runId,
        },
        conversationId: {
          DataType: "String",
          StringValue: payload.conversationId,
        },
      },
    });

    const response = await client.send(command);
    console.log(`[SQS] Enqueued AI job ${payload.runId}, SQS MessageId: ${response.MessageId}`);
    return { success: true, messageId: response.MessageId };
  } catch (error: any) {
    console.error(`[SQS] Error dispatching message to SQS for run ${payload.runId}:`, error);
    throw error;
  }
}
