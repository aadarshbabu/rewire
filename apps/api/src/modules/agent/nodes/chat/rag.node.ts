import { GraphRagService } from '../../rag/graph-rag.service';
import { RedisStreamService } from '../../../redis/redis-stream.service';
import { AgentStateType } from '../../graph/states';

export function createRagNode(
  ragService: GraphRagService,
  redisStreamService: RedisStreamService,
) {
  return async (state: AgentStateType): Promise<Partial<AgentStateType>> => {
    if (state.isCrisis) {
      return { retrievedKnowledge: [] };
    }

    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.started',
      runId: state.runId,
      node: 'neo4j-rag',
      timestamp: Date.now(),
    });

    const knowledge = await ragService.retrieveContext(state.currentMessage, state.userId);

    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.completed',
      runId: state.runId,
      node: 'neo4j-rag',
      timestamp: Date.now(),
    });

    return {
      retrievedKnowledge: knowledge,
    };
  };
}
