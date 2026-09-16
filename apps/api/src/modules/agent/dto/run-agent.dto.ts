import type { AiJobPayload } from '@rewire/types';

export class RunAgentDto implements AiJobPayload {
  runId!: string;
  conversationId!: string;
  messageId!: string;
  userId!: string;
}
