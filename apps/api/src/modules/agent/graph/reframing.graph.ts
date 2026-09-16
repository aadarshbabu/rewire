import { StateGraph, START, END } from '@langchain/langgraph';
import { ReframingAgentState } from './states/reframing-state';
import { UserJourneyService } from '../services/user-journey.service';
import { GraphRagService } from '../rag/graph-rag.service';
import {
  createReframingHistoryNode,
  createReframingKnowledgeNode,
  createReframingGenerateNode,
} from '../nodes/reframe';

export function buildReframingGraph(
  userJourneyService: UserJourneyService,
  ragService: GraphRagService,
) {
  const workflow = new StateGraph(ReframingAgentState)
    .addNode('loadHistory', createReframingHistoryNode(userJourneyService))
    .addNode('loadKnowledge', createReframingKnowledgeNode(ragService))
    .addNode('generate', createReframingGenerateNode());

  // Pipeline flow: START -> loadHistory -> loadKnowledge -> generate -> END
  workflow.addEdge(START, 'loadHistory');
  workflow.addEdge('loadHistory', 'loadKnowledge');
  workflow.addEdge('loadKnowledge', 'generate');
  workflow.addEdge('generate', END);

  return workflow.compile();
}

export type CompiledReframingGraph = ReturnType<typeof buildReframingGraph>;
