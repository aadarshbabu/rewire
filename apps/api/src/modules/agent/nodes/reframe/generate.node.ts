import { Logger } from '@nestjs/common';
import { ReframingAgentStateType } from '../../graph/states/reframing-state';
import { ReframingAnalysis } from '@rewire/types';
import { buildReframingPrompt } from '../../prompts/reframing.prompt';
import { generateHeuristicReframing } from './reframing-heuristic';

const logger = new Logger('ReframingGenerateNode');

export function createReframingGenerateNode() {
  return async (state: ReframingAgentStateType): Promise<Partial<ReframingAgentStateType>> => {
    const apiKey = process.env.MISTRAL_API_KEY;

    // 1. If Mistral API key is configured, call ChatMistralAI with holistic user context
    if (apiKey && apiKey !== 'your-mistral-api-key-here') {
      try {
        logger.log('Invoking LangChain ChatMistralAI for agentic cognitive reframing...');
        const { ChatMistralAI } = await import('@langchain/mistralai');
        const model = new ChatMistralAI({
          apiKey,
          model: process.env.MISTRAL_MODEL || 'mistral-large-latest',
          temperature: 0.3,
        });

        // Assemble user journey context
        let historyContext = 'No prior session history available for this user (First time).';
        if (state.userHistory && state.userHistory.pastEntries.length > 0) {
          const pastSummary = state.userHistory.pastEntries
            .map(
              (e, idx) =>
                `Session ${idx + 1}: Title "${e.title}", Mood: ${e.moodBefore ?? 'N/A'} -> ${e.moodAfter ?? 'N/A'}, Action: ${e.actionTaken ?? 'saved'}, Snippet: "${e.rawContent.slice(0, 100)}"`,
            )
            .join('\n');
          historyContext = `USER'S PAST JOURNEY & HISTORY (${state.userHistory.userName || 'User'}):\n${pastSummary}\nRecurring distress themes: ${state.userHistory.recurringDistressTags.join(', ')}`;
        }

        // Assemble Neo4j knowledge context
        let knowledgeContext = '';
        if (state.retrievedKnowledge && state.retrievedKnowledge.length > 0) {
          knowledgeContext = state.retrievedKnowledge
            .map((k) => `- ${k.concept} (${k.category}): ${k.description}. Strategies: ${k.strategies.join(', ')}`)
            .join('\n');
        }

        // Cleanly inject prompt from prompts/reframing.prompt
        const prompt = buildReframingPrompt({
          historyContext,
          knowledgeContext,
          rawContent: state.rawContent,
          moodBefore: state.moodBefore,
          distressTags: state.distressTags,
        });

        const response = await model.invoke(prompt, {
          runName: 'MistralReframingInvoke',
          tags: ['llm-generation', 'reframing'],
        });
        const text = typeof response.content === 'string' ? response.content : '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned) as ReframingAnalysis;

        logger.log('Successfully generated agentic reframing analysis using LangChain Mistral AI');
        return { result: parsed };
      } catch (err: any) {
        logger.error(
          `LangChain LLM reframing failed: ${err.message}. Falling back to clinical heuristic engine.`,
          err.stack,
        );
      }
    } else {
      logger.log('No MISTRAL_API_KEY configured. Running clinical heuristic CBT engine.');
    }

    // 2. Fallback heuristic execution
    const fallbackResult = generateHeuristicReframing(state);
    return { result: fallbackResult };
  };
}
