import { ConversationsService } from '../../../conversations/conversations.service';
import { RedisStreamService } from '../../../redis/redis-stream.service';
import { AgentStateType } from '../../graph/states';

export function createPersistNode(
  conversationsService: ConversationsService,
  redisStreamService: RedisStreamService,
) {
  return async (state: AgentStateType): Promise<Partial<AgentStateType>> => {
    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.started',
      runId: state.runId,
      node: 'persist-result',
      timestamp: Date.now(),
    });

    const savedMsg = await conversationsService.saveAssistantMessage(
      state.conversationId,
      state.response,
    );

    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.completed',
      runId: state.runId,
      node: 'persist-result',
      timestamp: Date.now(),
    });

    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'run.completed',
      runId: state.runId,
      messageId: savedMsg?.id || '',
      content: state.response,
      timestamp: Date.now(),
    });

    return {};
  };
}
