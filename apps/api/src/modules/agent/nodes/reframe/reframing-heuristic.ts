import { ReframingAgentStateType } from '../../graph/states/reframing-state';
import { ReframingAnalysis, CognitiveDistortionItem } from '@rewire/types';

export const KNOWN_DISTORTIONS = [
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

/**
 * Offline clinical CBT heuristic engine used when external LLM is unavailable or unconfigured.
 */
export function generateHeuristicReframing(state: ReframingAgentStateType): ReframingAnalysis {
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
