import { ConversationsService } from '../../../conversations/conversations.service';
import { RedisStreamService } from '../../../redis/redis-stream.service';
import { AgentStateType } from '../../graph/states';

export function createLoadContextNode(
  conversationsService: ConversationsService,
  redisStreamService: RedisStreamService,
) {
  return async (state: AgentStateType): Promise<Partial<AgentStateType>> => {
    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.started',
      runId: state.runId,
      node: 'load-context',
      timestamp: Date.now(),
    });

    const history = await conversationsService.getConversationContext(state.conversationId, 15);
    const lastUserMsg = history
      .slice()
      .reverse()
      .find((m) => m.role === 'user');

    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.completed',
      runId: state.runId,
      node: 'load-context',
      timestamp: Date.now(),
    });

    return {
      history,
      currentMessage: lastUserMsg?.content || '',
    };
  };
}
