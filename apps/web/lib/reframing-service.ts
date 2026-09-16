import { ReframingAnalysis, CognitiveDistortionItem } from "@rewire/types";

/**
 * Common Cognitive Distortions dictionary with clinical definitions and reframing prompts.
 */
const KNOWN_DISTORTIONS = [
  {
    name: "Catastrophizing",
    keywords: ["ruined", "disaster", "never recover", "worst", "everything is ruined", "end of the world", "unbearable", "hopeless"],
    description: "Anticipating the absolute worst-case scenario while underestimating your resilience to handle challenges.",
    reframeAdvice: "What is a more realistic, middle-ground outcome? Even if things are difficult, what evidence shows you can cope?",
  },
  {
    name: "All-or-Nothing Thinking",
    keywords: ["always", "never", "total failure", "completely failed", "ruined everything", "nothing works", "useless", "nobody"],
    description: "Viewing situations in black-and-white categories, ignoring nuances and partial successes.",
    reframeAdvice: "Can both things be true? You can struggle in one aspect while still making meaningful progress elsewhere.",
  },
  {
    name: "Should & Must Statements",
    keywords: ["should have", "must", "ought to", "supposed to", "should be better", "shouldn't feel"],
    description: "Imposing rigid demands on yourself, leading to unnecessary guilt and self-criticism.",
    reframeAdvice: "Replace 'I should' with 'I would prefer to' or 'It is understandable that I needed rest/time today.'",
  },
  {
    name: "Mind Reading / Fortune Telling",
    keywords: ["they think", "everyone thinks", "judge me", "going to fail", "they will hate", "they probably think", "sure they will"],
    description: "Assuming you know others' thoughts or predicting future failure without factual evidence.",
    reframeAdvice: "Do you have verifiable proof of what others think, or is anxiety filling in the blanks with worst-case assumptions?",
  },
  {
    name: "Emotional Reasoning",
    keywords: ["feel like a failure", "feels impossible", "feel stupid", "feels overwhelming", "feel stuck"],
    description: "Believing that because you feel a negative emotion strongly, it must reflect reality.",
    reframeAdvice: "Emotions are real internal signals, but feelings are not permanent objective facts.",
  },
];

/**
 * Clinical CBT Heuristic Parser for cognitive reframing.
 * Provides rich, empathetic, and actionable reframing even without an active external LLM.
 */
function analyzeWithHeuristics(rawContent: string): ReframingAnalysis {
  const lower = rawContent.toLowerCase();
  const sentences = rawContent
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const detectedDistortions: CognitiveDistortionItem[] = [];
  const inControl: string[] = [];
  const outsideControl: string[] = [];

  // 1. Detect Cognitive Distortions
  for (const dist of KNOWN_DISTORTIONS) {
    for (const kw of dist.keywords) {
      if (lower.includes(kw)) {
        // Find matching sentence
        const matchingSentence =
          sentences.find((s) => s.toLowerCase().includes(kw)) ||
          `Thoughts around "${kw}" in your dump.`;

        detectedDistortions.push({
          id: `dist-${detectedDistortions.length + 1}`,
          name: dist.name,
          description: dist.description,
          detectedThought: matchingSentence.slice(0, 140),
          compassionateReframe: `${dist.reframeAdvice} Remember: Having a difficult thought does not make it an inevitable truth.`,
        });
        break; // Only one match per distortion category
      }
    }
  }

  // Fallback distortion if no exact keyword match
  if (detectedDistortions.length === 0) {
    detectedDistortions.push({
      id: "dist-1",
      name: "Cognitive Overload / Hyper-vigilance",
      description: "Carrying too many open mental loops simultaneously, making every task feel equally urgent and heavy.",
      detectedThought: sentences[0] || rawContent.slice(0, 100),
      compassionateReframe: "You are not failing; your mental RAM is simply full. Dumping these thoughts on paper creates immediate breathing room.",
    });
  }

  // 2. Separate into Circle of Control
  const controlKeywords = ["i need to", "i can", "i will", "call", "email", "finish", "clean", "organize", "plan", "write", "talk"];
  const outsideKeywords = ["they", "boss", "traffic", "weather", "economy", "future", "past", "what if", "tomorrow", "reaction", "feeling sick", "uncertain"];

  for (const s of sentences) {
    const sLower = s.toLowerCase();
    if (outsideKeywords.some((k) => sLower.includes(k))) {
      outsideControl.push(s);
    } else if (controlKeywords.some((k) => sLower.includes(k)) || sLower.startsWith("i ")) {
      inControl.push(s);
    }
  }

  // Ensure default helpful items in Circle of Control
  if (inControl.length === 0) {
    inControl.push("How you choose to pace yourself for the remainder of today");
    inControl.push("Taking 3 slow deep breaths to regulate your nervous system");
    inControl.push("Deciding to step away from screens or take a short break");
  } else {
    // Limit to top 4 for clarity and anti-overwhelm
    inControl.splice(4);
  }

  if (outsideControl.length === 0) {
    outsideControl.push("Other people's immediate reactions and expectations");
    outsideControl.push("The uncontrollable speed of future events");
    outsideControl.push("Mistakes or conversations that have already happened in the past");
  } else {
    outsideControl.splice(4);
  }

  // 3. Extract 1 gentle micro-action (2-minute rule)
  const microAction =
    inControl.length > 0
      ? `Pick just ONE small item: "${inControl[0].slice(0, 60)}". Spend 2 minutes preparing it, or intentionally close the notebook for 10 minutes to drink a glass of water.`
      : "Drink a glass of cold water, gently roll your shoulders back, and give yourself permission not to solve everything this hour.";

  const groundingAffirmation =
    "You have pulled these thoughts out of the dark into the light. Thoughts are mental events, not orders or destiny. You are safe in this present moment.";

  return {
    summary: `Your mind was holding ${sentences.length} distinct thought threads. By offloading them, you reduce mental friction and regain clarity.`,
    circleOfControl: {
      inControl,
      outsideControl,
    },
    distortions: detectedDistortions.slice(0, 3),
    microAction,
    groundingAffirmation,
  };
}

/**
 * Delegates cognitive reframing to the NestJS AI Worker (apps/api), which runs
 * the LangGraph agent workflow with user history, previous entries, and Neo4j GraphRAG.
 * Falls back to clinical heuristics if the worker is offline.
 */
export async function reframeBrainDump(
  rawContent: string,
  moodBefore?: number | null,
  userId?: string,
  distressTags?: string[],
): Promise<ReframingAnalysis> {
  const workerBaseUrl = process.env.AI_WORKER_URL || "http://localhost:4000";
  const endpoint = `${workerBaseUrl}/agent/reframe`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        rawContent,
        moodBefore: moodBefore ?? undefined,
        distressTags: distressTags ?? [],
      }),
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      return data as ReframingAnalysis;
    }

    console.warn(`[ReframingService] AI worker responded with status ${response.status}. Using clinical fallback.`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[ReframingService] Could not reach AI worker (${endpoint}): ${msg}. Running offline clinical fallback.`);
  }

  // Graceful offline fallback for local development
  return analyzeWithHeuristics(rawContent);
}
