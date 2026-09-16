import { SafetyService } from '../../safety/safety.service';
import { CRISIS_ESCALATION_TEMPLATE } from '../../prompts/mental-health.prompt';
import { RedisStreamService } from '../../../redis/redis-stream.service';
import { AgentStateType } from '../../graph/states';

export function createSafetyNode(
  safetyService: SafetyService,
  redisStreamService: RedisStreamService,
) {
  return async (state: AgentStateType): Promise<Partial<AgentStateType>> => {
    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.started',
      runId: state.runId,
      node: 'safety-assessment',
      timestamp: Date.now(),
    });

    const assessment = safetyService.assessInputRisk(state.currentMessage);

    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.completed',
      runId: state.runId,
      node: 'safety-assessment',
      timestamp: Date.now(),
    });

    if (assessment.isCrisis) {
      return {
        safetyAssessment: assessment,
        isCrisis: true,
        response: CRISIS_ESCALATION_TEMPLATE,
      };
    }

    return {
      safetyAssessment: assessment,
      isCrisis: false,
    };
  };
}
