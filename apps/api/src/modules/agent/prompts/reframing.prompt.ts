export interface ReframingPromptParams {
  historyContext: string;
  knowledgeContext?: string;
  rawContent: string;
  moodBefore?: number | null;
  distressTags: string[];
}

export const REFRAMING_SYSTEM_ROLE = `You are Rewire's Clinical Cognitive Behavioral Therapy (CBT) Agent.
Your task is to analyze a user's raw stream-of-consciousness brain dump using their holistic history, personal journey, and evidence-based coping knowledge.`;

export const REFRAMING_JSON_SCHEMA_EXAMPLE = `{
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
}`;

/**
 * Builds the complete prompt string for cognitive reframing.
 */
export function buildReframingPrompt(params: ReframingPromptParams): string {
  const { historyContext, knowledgeContext, rawContent, moodBefore, distressTags } = params;

  return `${REFRAMING_SYSTEM_ROLE}

${historyContext}

${knowledgeContext ? `EVIDENCE-BASED COPING KNOWLEDGE (from Neo4j GraphRAG):\n${knowledgeContext}\n` : ''}

CURRENT RAW BRAIN DUMP:
"""
${rawContent}
"""

CURRENT BASELINE DISTRESS: ${moodBefore ?? 'Unknown'}/10
ACTIVE EMOTION TAGS: ${distressTags.length > 0 ? distressTags.join(', ') : 'None specified'}

INSTRUCTIONS:
1. Identify how today's brain dump connects with the user's ongoing journey and recurring patterns (the "evolutionNote").
2. Separate dumped thoughts into the Circle of Control (what is genuinely in their control vs what is outside their control).
3. Unmask 1-3 cognitive distortions (e.g. Catastrophizing, All-or-Nothing, Should-Statements, Mind-Reading) with compassionate reframes.
4. Formulate ONE realistic 2-minute micro-action to restore agency without causing overwhelm.
5. Provide a grounding affirmation.

Respond ONLY with a valid JSON object matching this schema:
${REFRAMING_JSON_SCHEMA_EXAMPLE}

OUTPUT VALID JSON ONLY. NO MARKDOWN FENCES.`;
}
