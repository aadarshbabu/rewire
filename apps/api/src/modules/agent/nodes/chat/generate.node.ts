import { Logger } from '@nestjs/common';
import { RedisStreamService } from '../../../redis/redis-stream.service';
import { MENTAL_HEALTH_SYSTEM_PROMPT } from '../../prompts/mental-health.prompt';
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
  BaseMessage,
} from '@langchain/core/messages';
import { AgentStateType } from '../../graph/states';

const logger = new Logger('ChatGenerateNode');

export function createGenerateNode(redisStreamService: RedisStreamService) {
  return async (state: AgentStateType): Promise<Partial<AgentStateType>> => {
    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.started',
      runId: state.runId,
      node: 'generate',
      timestamp: Date.now(),
    });

    // 1. If a crisis was detected by safety node, stream crisis response and exit
    if (state.isCrisis) {
      await redisStreamService.publishStreamEvent(state.runId, {
        type: 'message.delta',
        runId: state.runId,
        content: state.response,
        timestamp: Date.now(),
      });

      await redisStreamService.publishStreamEvent(state.runId, {
        type: 'node.completed',
        runId: state.runId,
        node: 'generate',
        timestamp: Date.now(),
      });

      return {};
    }

    // 2. Build knowledge context block from Neo4j GraphRAG
    let knowledgeContext = '';
    if (state.retrievedKnowledge && state.retrievedKnowledge.length > 0) {
      knowledgeContext = state.retrievedKnowledge
        .map(
          (k) =>
            `- ${k.concept} (${k.category}): ${k.description}. Strategies: ${k.strategies.join(', ')}`,
        )
        .join('\n');
    }

    // 3. Assemble system prompt with GraphRAG knowledge
    let systemPrompt = MENTAL_HEALTH_SYSTEM_PROMPT;
    if (knowledgeContext) {
      systemPrompt += `\n\nRELEVANT EVIDENCE-BASED COPING KNOWLEDGE (from Neo4j GraphRAG):\n${knowledgeContext}\nUse this knowledge naturally to inform your empathetic grounding response.`;
    }

    // 4. Assemble chat message history for Mistral AI
    const chatMessages: BaseMessage[] = [new SystemMessage(systemPrompt)];

    for (const msg of state.history || []) {
      if (msg.role === 'user') {
        chatMessages.push(new HumanMessage(msg.content));
      } else if (msg.role === 'assistant') {
        chatMessages.push(new AIMessage(msg.content));
      }
    }

    // Ensure the current user message is included at the end of the prompt
    const lastMsg = state.history && state.history[state.history.length - 1];
    if (state.currentMessage && (!lastMsg || lastMsg.content !== state.currentMessage)) {
      chatMessages.push(new HumanMessage(state.currentMessage));
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    const modelName = process.env.MISTRAL_MODEL || 'mistral-large-latest';

    // 5. If MISTRAL_API_KEY is configured, call Mistral AI model and stream tokens
    if (apiKey) {
      try {
        logger.log(`Invoking Mistral AI (${modelName}) with streaming...`);
        const { ChatMistralAI } = await import('@langchain/mistralai');
        const model = new ChatMistralAI({
          apiKey,
          model: modelName,
          temperature: 0.7
        });

        const stream = await model.stream(chatMessages, {
          runName: 'MistralChatStream',
          tags: ['llm-generation', 'chat-response'],
        });
        let fullGeneratedText = '';

        for await (const chunk of stream) {
          const textDelta = typeof chunk.content === 'string' ? chunk.content : '';
          if (textDelta) {
            fullGeneratedText += textDelta;
            await redisStreamService.publishStreamEvent(state.runId, {
              type: 'message.delta',
              runId: state.runId,
              content: textDelta,
              timestamp: Date.now(),
            });
          }
        }

        await redisStreamService.publishStreamEvent(state.runId, {
          type: 'node.completed',
          runId: state.runId,
          node: 'generate',
          timestamp: Date.now(),
        });

        return {
          response: fullGeneratedText,
        };
      } catch (error: any) {
        logger.error(`Mistral AI streaming failed: ${error.message}. Falling back to grounding generator.`, error.stack);
      }
    } else {
      logger.warn('MISTRAL_API_KEY not set. Using local development fallback response.');
    }

    // Fallback generation for local development / testing without an API key
    const fallbackText = knowledgeContext
      ? `Thank you for sharing that with me. I hear you, and it is completely normal to feel this way. Here is a grounding perspective that might help:\n${knowledgeContext}\n\nHow does this feel to you? Take your time, I am here with you.`
      : `Thank you for reaching out and sharing what is on your mind. I am here to listen and support you through this. Can you tell me a little more about what has been feeling most overwhelming lately?`;

    const words = fallbackText.split(' ');
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join(' ') + ' ';
      await redisStreamService.publishStreamEvent(state.runId, {
        type: 'message.delta',
        runId: state.runId,
        content: chunk,
        timestamp: Date.now(),
      });
    }

    await redisStreamService.publishStreamEvent(state.runId, {
      type: 'node.completed',
      runId: state.runId,
      node: 'generate',
      timestamp: Date.now(),
    });

    return {
      response: fallbackText,
    };
  };
}
