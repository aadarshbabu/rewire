import { SafetyService } from '../../safety/safety.service';
import { RedisStreamService } from '../../../redis/redis-stream.service';
import { AgentStateType } from '../../graph/states';

export function createResponseSafetyNode(
  safetyService: SafetyService,
  redisStreamService: RedisStreamService,
) {
  return async (state: AgentStateType): Promise<Partial<AgentStateType>> => {
    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.started',
      runId: state.runId,
      node: 'response-safety',
      timestamp: Date.now(),
    });

    const { sanitizedText } = safetyService.validateGeneratedResponse(state.response);

    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.completed',
      runId: state.runId,
      node: 'response-safety',
      timestamp: Date.now(),
    });

    return {
      response: sanitizedText,
    };
  };
}
