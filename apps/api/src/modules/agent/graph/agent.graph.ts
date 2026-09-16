import { StateGraph, START, END } from '@langchain/langgraph';
import { ConversationsService } from '../../conversations/conversations.service';
import { RedisStreamService } from '../../redis/redis-stream.service';
import { SafetyService } from '../safety/safety.service';
import { GraphRagService } from '../rag/graph-rag.service';
import { AgentState, AgentStateType } from './states';
import {
  createLoadContextNode,
  createSafetyNode,
  createRagNode,
  createGenerateNode,
  createResponseSafetyNode,
  createPersistNode,
} from '../nodes/chat';


export function buildAgentGraph(
  conversationsService: ConversationsService,
  safetyService: SafetyService,
  ragService: GraphRagService,
  redisStreamService: RedisStreamService,
) {
  const workflow = new StateGraph(AgentState)
    .addNode('loadContext', createLoadContextNode(conversationsService, redisStreamService))
    .addNode('assessSafety', createSafetyNode(safetyService, redisStreamService))
    .addNode('neo4jRag', createRagNode(ragService, redisStreamService))
    .addNode('generate', createGenerateNode(redisStreamService))
    .addNode('responseSafety', createResponseSafetyNode(safetyService, redisStreamService))
    .addNode('persist', createPersistNode(conversationsService, redisStreamService));

  // START -> loadContext -> assessSafety
  workflow.addEdge(START, 'loadContext');
  workflow.addEdge('loadContext', 'assessSafety');

  // Conditional routing: if crisis detected, skip Neo4j RAG and jump directly to generate (which uses crisis template)
  workflow.addConditionalEdges('assessSafety', (state: AgentStateType) => {
    return state.isCrisis ? 'generate' : 'neo4jRag';
  }, {
    generate: 'generate',
    neo4jRag: 'neo4jRag',
  });

  workflow.addEdge('neo4jRag', 'generate');
  workflow.addEdge('generate', 'responseSafety');
  workflow.addEdge('responseSafety', 'persist');
  workflow.addEdge('persist', END);

  return workflow.compile();
}

export type CompiledAgentGraph = ReturnType<typeof buildAgentGraph>;
