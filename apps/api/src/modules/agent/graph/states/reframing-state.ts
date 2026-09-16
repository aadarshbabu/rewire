import { Annotation } from '@langchain/langgraph';
import { ReframingAnalysis } from '@rewire/types';
import { RetrievedKnowledgeItem } from '../../rag/graph-rag.service';

export interface UserHistoryContext {
  userName?: string;
  pastEntries: Array<{
    id: string;
    title: string | null;
    rawContent: string;
    moodBefore: number | null;
    moodAfter: number | null;
    actionTaken: string | null;
    createdAt: Date;
  }>;
  recentConversationSnippets: string[];
  recurringDistressTags: string[];
}

export const ReframingAgentState = Annotation.Root({
  userId: Annotation<string | undefined>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => undefined,
  }),
  rawContent: Annotation<string>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => '',
  }),
  moodBefore: Annotation<number | undefined>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => undefined,
  }),
  distressTags: Annotation<string[]>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => [],
  }),
  userHistory: Annotation<UserHistoryContext>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => ({
      pastEntries: [],
      recentConversationSnippets: [],
      recurringDistressTags: [],
    }),
  }),
  retrievedKnowledge: Annotation<RetrievedKnowledgeItem[]>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => [],
  }),
  result: Annotation<ReframingAnalysis | null>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => null,
  }),
  error: Annotation<string | null>({
    reducer: (x, y) => (y !== undefined ? y : x),
    default: () => null,
  }),
});

export type ReframingAgentStateType = typeof ReframingAgentState.State;
