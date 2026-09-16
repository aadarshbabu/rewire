import { Logger } from '@nestjs/common';
import { ReframingAgentStateType } from '../graph/states/reframing-state';
import { ReframingAnalysis, CognitiveDistortionItem } from '@rewire/types';

const logger = new Logger('ReframingGenerateNode');

const KNOWN_DISTORTIONS = [
  {
    name: 'Catastrophizing',
    keywords: ['ruined', 'disaster', 'never recover', 'worst', 'everything is ruined', 'end of the world', 'unbearable', 'hopeless'],
    description: 'Anticipating the absolute worst-case scenario while underestimating your resilience to handle challenges.',
    reframeAdvice: 'What is a more realistic, middle-ground outcome? Even if things are difficult, what evidence shows you can cope?',
  },
  {
    name: 'All-or-Nothing Thinking',
    keywords: ['always', 'never', 'total failure', 'completely failed', 'ruined everything', 'nothing works', 'useless', 'nobody'],
    description: 'Viewing situations in black-and-white categories, ignoring nuances and partial successes.',
    reframeAdvice: 'Can both things be true? You can struggle in one aspect while still making meaningful progress elsewhere.',
  },
  {
    name: 'Should & Must Statements',
    keywords: ['should have', 'must', 'ought to', 'supposed to', 'should be better', 'shouldn\'t feel'],
    description: 'Imposing rigid demands on yourself, leading to unnecessary guilt and self-criticism.',
    reframeAdvice: 'Replace "I should" with "I would prefer to" or "It is understandable that I needed rest/time today."',
  },
  {
    name: 'Mind Reading / Fortune Telling',
    keywords: ['they think', 'everyone thinks', 'judge me', 'going to fail', 'they will hate', 'they probably think', 'sure they will'],
    description: 'Assuming you know others\' thoughts or predicting future failure without factual evidence.',
    reframeAdvice: 'Do you have verifiable proof of what others think, or is anxiety filling in the blanks with worst-case assumptions?',
  },
  {
    name: 'Emotional Reasoning',
    keywords: ['feel like a failure', 'feels impossible', 'feel stupid', 'feels overwhelming', 'feel stuck'],
    description: 'Believing that because you feel a negative emotion strongly, it must reflect reality.',
    reframeAdvice: 'Emotions are real internal signals, but feelings are not permanent objective facts.',
  },
];

function generateHeuristicReframing(state: ReframingAgentStateType): ReframingAnalysis {
  const { rawContent, userHistory, distressTags } = state;
  const lower = rawContent.toLowerCase();
  const sentences = rawContent
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const detectedDistortions: CognitiveDistortionItem[] = [];
  const inControl: string[] = [];
  const outsideControl: string[] = [];

  // Detect distortions
  for (const dist of KNOWN_DISTORTIONS) {
    for (const kw of dist.keywords) {
      if (lower.includes(kw)) {
        const matchingSentence =
          sentences.find((s) => s.toLowerCase().includes(kw)) ||
          `Thoughts around "${kw}" in your brain dump.`;

        detectedDistortions.push({
          id: `dist-${detectedDistortions.length + 1}`,
          name: dist.name,
          description: dist.description,
          detectedThought: matchingSentence.slice(0, 140),
          compassionateReframe: `${dist.reframeAdvice} Remember: Having a difficult thought does not make it an inevitable truth.`,
        });
        break;
      }
    }
  }

  if (detectedDistortions.length === 0) {
    detectedDistortions.push({
      id: 'dist-1',
      name: 'Cognitive Overload / Hyper-vigilance',
      description: 'Carrying too many open mental loops simultaneously, making every task feel equally urgent and heavy.',
      detectedThought: sentences[0] || rawContent.slice(0, 100),
      compassionateReframe: 'You are not failing; your mental RAM is simply full. Dumping these thoughts on paper creates immediate breathing room.',
    });
  }

  // Circle of Control
  const controlKeywords = ['i need to', 'i can', 'i will', 'call', 'email', 'finish', 'clean', 'organize', 'plan', 'write', 'talk'];
  const outsideKeywords = ['they', 'boss', 'traffic', 'weather', 'economy', 'future', 'past', 'what if', 'tomorrow', 'reaction', 'feeling sick', 'uncertain'];

  for (const s of sentences) {
    const sLower = s.toLowerCase();
    if (outsideKeywords.some((k) => sLower.includes(k))) {
      outsideControl.push(s);
    } else if (controlKeywords.some((k) => sLower.includes(k)) || sLower.startsWith('i ')) {
      inControl.push(s);
    }
  }

  if (inControl.length === 0) {
    inControl.push('How you choose to pace yourself for the remainder of today');
    inControl.push('Taking 3 slow deep breaths to regulate your nervous system');
    inControl.push('Deciding to step away from screens or take a short break');
  } else {
    inControl.splice(4);
  }

  if (outsideControl.length === 0) {
    outsideControl.push('Other people\'s immediate reactions and expectations');
    outsideControl.push('The uncontrollable speed of future events');
    outsideControl.push('Mistakes or conversations that have already happened in the past');
  } else {
    outsideControl.splice(4);
  }

  // Build Personalized Evolution Note from User History
  let evolutionNote = 'Every time you externalize your thoughts onto paper, you interrupt the cycle of rumination and reclaim cognitive bandwidth.';
  if (userHistory && userHistory.pastEntries.length > 0) {
    const previousEntriesCount = userHistory.pastEntries.length;
    const relievedEntries = userHistory.pastEntries.filter(
      (e) => e.moodBefore !== null && e.moodAfter !== null && e.moodAfter < e.moodBefore,
    );

    if (relievedEntries.length > 0) {
      evolutionNote = `You have completed ${previousEntriesCount} reflection sessions previously. In past entries, taking a step back consistently reduced your stress levels. Notice how your mind can find calm again today.`;
    } else {
      evolutionNote = `You are building a consistent habit of mindful externalization across your journey (${previousEntriesCount} entries recorded).`;
    }
  }

  const microAction =
    inControl.length > 0
      ? `Pick just ONE item: "${inControl[0].slice(0, 60)}". Spend 2 minutes preparing it, or intentionally close this notebook for 10 minutes to drink a glass of water.`
      : 'Drink a glass of cold water, gently roll your shoulders back, and give yourself permission not to solve everything this hour.';

  return {
    summary: `Your mind was holding ${sentences.length} distinct thought threads. By offloading them, you reduce mental friction and regain clarity.`,
    evolutionNote,
    recurringPatterns: userHistory?.recurringDistressTags?.slice(0, 3) || distressTags.slice(0, 3),
    circleOfControl: {
      inControl,
      outsideControl,
    },
    distortions: detectedDistortions.slice(0, 3),
    microAction,
    groundingAffirmation: 'You have pulled these thoughts out of the dark into the light. Thoughts are mental events, not orders or destiny. You are safe in this present moment.',
  };
}

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

        const prompt = `You are Rewire's Clinical Cognitive Behavioral Therapy (CBT) Agent.
Your task is to analyze a user's raw stream-of-consciousness brain dump using their holistic history, personal journey, and evidence-based coping knowledge.

${historyContext}

${knowledgeContext ? `EVIDENCE-BASED COPING KNOWLEDGE (from Neo4j GraphRAG):\n${knowledgeContext}\n` : ''}

CURRENT RAW BRAIN DUMP:
"""
${state.rawContent}
"""

CURRENT BASELINE DISTRESS: ${state.moodBefore ?? 'Unknown'}/10
ACTIVE EMOTION TAGS: ${state.distressTags.join(', ')}

INSTRUCTIONS:
1. Identify how today's brain dump connects with the user's ongoing journey and recurring patterns (the "evolutionNote").
2. Separate dumped thoughts into the Circle of Control (what is genuinely in their control vs what is outside their control).
3. Unmask 1-3 cognitive distortions (e.g. Catastrophizing, All-or-Nothing, Should-Statements, Mind-Reading) with compassionate reframes.
4. Formulate ONE realistic 2-minute micro-action to restore agency without causing overwhelm.
5. Provide a grounding affirmation.

Respond ONLY with a valid JSON object matching this schema:
{
  "summary": "Brief 1-2 sentence empathetic summary of the mental clutter",
  "evolutionNote": "A warm, personalized observation connecting today's thoughts to their past journey and recurring patterns",
  "recurringPatterns": ["1-3 recurring patterns or themes observed in this user's story"],
  "circleOfControl": {
    "inControl": ["2-3 specific things the user has agency over right now"],
    "outsideControl": ["2-3 things that belong to others, the past, or uncertainty to accept and surrender"]
  },
  "distortions": [
    {
      "id": "dist-1",
      "name": "Cognitive Distortion Name",
      "description": "Brief explanation of this cognitive trap",
      "detectedThought": "The exact or summarized thought from the dump",
      "compassionateReframe": "A warm, balanced, objective reframe that de-escalates anxiety"
    }
  ],
  "microAction": "ONE single 2-minute low-friction next step",
  "groundingAffirmation": "A compassionate, trauma-informed closing validation"
}

OUTPUT VALID JSON ONLY. NO MARKDOWN FENCES.`;

        const response = await model.invoke(prompt);
        const text = typeof response.content === 'string' ? response.content : '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned) as ReframingAnalysis;

        logger.log('Successfully generated agentic reframing analysis using LangChain Mistral AI');
        return { result: parsed };
      } catch (err: any) {
        logger.error(`LangChain LLM reframing failed: ${err.message}. Falling back to clinical heuristic engine.`, err.stack);
      }
    } else {
      logger.log('No MISTRAL_API_KEY configured. Running clinical heuristic CBT engine.');
    }

    // 2. Fallback heuristic execution
    const fallbackResult = generateHeuristicReframing(state);
    return { result: fallbackResult };
  };
}
