import { Annotation } from '@langchain/langgraph';
import { ConversationMessage } from '@rewire/types';
import { SafetyCheckResult } from '../../safety/safety.service';
import { RetrievedKnowledgeItem } from '../../rag/graph-rag.service';

export const AgentState = Annotation.Root({
  runId: Annotation<string>(),
  conversationId: Annotation<string>(),
  messageId: Annotation<string>(),
  userId: Annotation<string>(),
  history: Annotation<ConversationMessage[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  currentMessage: Annotation<string>({
    reducer: (_, next) => next,
    default: () => '',
  }),
  safetyAssessment: Annotation<SafetyCheckResult | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  retrievedKnowledge: Annotation<RetrievedKnowledgeItem[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  isCrisis: Annotation<boolean>({
    reducer: (_, next) => next,
    default: () => false,
  }),
  response: Annotation<string>({
    reducer: (_, next) => next,
    default: () => '',
  }),
  error: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
});

export type AgentStateType = typeof AgentState.State;
