import { Logger } from '@nestjs/common';
import { GraphRagService } from '../../rag/graph-rag.service';
import { ReframingAgentStateType } from '../../graph/states/reframing-state';

const logger = new Logger('ReframingKnowledgeNode');

export function createReframingKnowledgeNode(ragService: GraphRagService) {
  return async (state: ReframingAgentStateType): Promise<Partial<ReframingAgentStateType>> => {
    try {
      // Form query from rawContent and any active distress tags
      const queryContext = [
        state.distressTags.join(' '),
        state.rawContent.slice(0, 300),
      ].join(' ').trim();

      logger.log(`Querying Neo4j GraphRAG knowledge for reframing context...`);
      const retrievedKnowledge = await ragService.retrieveContext(queryContext, state.userId);

      logger.log(`Retrieved ${retrievedKnowledge.length} knowledge items from Neo4j`);
      return { retrievedKnowledge };
    } catch (err: any) {
      logger.warn(`Neo4j knowledge retrieval failed or skipped: ${err.message}`);
      return { retrievedKnowledge: [] };
    }
  };
}
