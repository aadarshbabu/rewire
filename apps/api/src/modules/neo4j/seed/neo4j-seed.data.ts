export interface SeedConcept {
  name: string;
  category: string;
  description: string;
  commonThoughts: string[];
  strategies: string[]; // names of strategies
  triggers: string[]; // names of trigger categories
  emotions: string[]; // names of emotions
}

export interface SeedStrategy {
  name: string;
  category: string;
  description: string;
  promptGuidance: string;
  counteractsEmotions: string[];
}

export interface SeedTrigger {
  name: string;
  description: string;
}

export interface SeedEmotion {
  name: string;
  valence: 'negative' | 'neutral' | 'positive';
}

export const SEED_EMOTIONS: SeedEmotion[] = [
  { name: 'Anxiety', valence: 'negative' },
  { name: 'Overwhelm', valence: 'negative' },
  { name: 'Dread', valence: 'negative' },
  { name: 'Frustration', valence: 'negative' },
  { name: 'Shame', valence: 'negative' },
  { name: 'Helplessness', valence: 'negative' },
  { name: 'Self-Doubt', valence: 'negative' },
  { name: 'Relief', valence: 'positive' },
  { name: 'Clarity', valence: 'positive' },
  { name: 'Agency', valence: 'positive' },
];

export const SEED_TRIGGERS: SeedTrigger[] = [
  { name: 'Work & Deadlines', description: 'Urgent deliverables, backlogs, sprint crunches, and professional expectations.' },
  { name: 'Interpersonal Conflict', description: 'Tension with coworkers, managers, friends, or family.' },
  { name: 'Perfectionism & Self-Doubt', description: 'Fear of mistakes, high internal standards, and fear of falling short.' },
  { name: 'Social Evaluation', description: 'Presentations, public speaking, code reviews, and meetings where judgment is anticipated.' },
  { name: 'Overcommitment & Burnout', description: 'Excessive workload, lack of rest, physical exhaustion, and chronic stress.' },
  { name: 'Financial Uncertainty', description: 'Budgeting worries, unstable income, expenses, and economic instability.' },
  { name: 'Health & Physical Anxiety', description: 'Somatic symptoms, poor sleep, fatigue, and bodily distress.' },
  { name: 'Future Uncertainty', description: 'Ambiguity regarding career trajectory, life changes, or open-ended outcomes.' },
];

export const SEED_STRATEGIES: SeedStrategy[] = [
  {
    name: 'Circle of Control Delineation',
    category: 'Cognitive Restructuring',
    description: 'Separate what is within direct personal agency from external circumstances, other people, or past events.',
    promptGuidance: 'Explicitly identify 2 things within control right now and 2 things outside control to gently let go of.',
    counteractsEmotions: ['Helplessness', 'Overwhelm', 'Anxiety'],
  },
  {
    name: 'Decatastrophizing Probability Matrix',
    category: 'Cognitive Restructuring',
    description: 'Contrast the worst-case scenario, the best-case scenario, and the realistically probable middle outcome.',
    promptGuidance: 'Ask what the most realistic 50% likelihood outcome is, and what proof exists that user can survive it.',
    counteractsEmotions: ['Dread', 'Anxiety'],
  },
  {
    name: 'Fact vs Feeling Separation Audit',
    category: 'Cognitive Restructuring',
    description: 'Recognize that emotional intensity is a somatic state, not verifiable factual evidence of reality.',
    promptGuidance: 'Validate the felt emotion as real, while examining whether the factual evidence supports the grim conclusion.',
    counteractsEmotions: ['Anxiety', 'Frustration', 'Self-Doubt'],
  },
  {
    name: 'Shades of Grey Spectrum',
    category: 'Cognitive Restructuring',
    description: 'Replace binary all-or-nothing judgments with continuous percentage-based progress or partial success.',
    promptGuidance: 'Highlight that progress is rarely binary; identify the 60-80% value delivered even with imperfections.',
    counteractsEmotions: ['Shame', 'Frustration', 'Self-Doubt'],
  },
  {
    name: 'Compassionate Friend Perspective',
    category: 'Compassion-Focused Therapy',
    description: 'Treat yourself with the same constructive patience, respect, and warmth you would offer a trusted friend.',
    promptGuidance: 'What compassionate, grounding advice would you speak to a friend experiencing this exact situation?',
    counteractsEmotions: ['Shame', 'Self-Doubt'],
  },
  {
    name: 'Two-Minute Behavioral Micro-Action',
    category: 'Behavioral Activation',
    description: 'Break mental paralysis by taking one frictionless physical or operational micro-step immediately.',
    promptGuidance: 'Suggest a single 2-minute physical or organizational action to break rumination and restore inertia.',
    counteractsEmotions: ['Helplessness', 'Overwhelm'],
  },
  {
    name: 'Evidence-Testing Audit',
    category: 'Cognitive Restructuring',
    description: 'Act as an objective courtroom juror: list actual evidence supporting the thought vs evidence against it.',
    promptGuidance: 'Ask for concrete documented data before accepting negative assumptions as truth.',
    counteractsEmotions: ['Anxiety', 'Self-Doubt'],
  },
  {
    name: 'Cognitive Defusion',
    category: 'Acceptance & Commitment Therapy',
    description: 'Notice thoughts as passing mental noise rather than mandatory truths or commands to be obeyed.',
    promptGuidance: 'Frame the thought as: "I am having the thought that...", untangling the person from the mental chatter.',
    counteractsEmotions: ['Overwhelm', 'Anxiety'],
  },
  {
    name: 'Somatic Box Breathing & Grounding',
    category: 'Somatic Regulation',
    description: 'Engage 4-4-4-4 diaphragmatic breathing to reset the autonomic nervous system and downregulate the amygdala.',
    promptGuidance: 'Incorporate a brief physical breath cue to signal physiological safety before cognitive analysis.',
    counteractsEmotions: ['Anxiety', 'Dread', 'Overwhelm'],
  },
  {
    name: 'Values-Based Action Step',
    category: 'Acceptance & Commitment Therapy',
    description: 'Shift focus away from fear of failure toward actions aligned with personal integrity and growth.',
    promptGuidance: 'Identify which core personal value (e.g. learning, craft, empathy) can guide the very next decision.',
    counteractsEmotions: ['Helplessness', 'Shame'],
  },
  {
    name: 'Worst/Best/Most Likely Analysis',
    category: 'Cognitive Restructuring',
    description: 'Map out the worst imaginable outcome, best fantasy, and realistic center to ground runaway anticipation.',
    promptGuidance: 'Outline the 3 branches: Worst Case, Best Case, and Most Probable Case to demystify anticipation.',
    counteractsEmotions: ['Dread', 'Anxiety'],
  },
  {
    name: 'Preferential Reframing',
    category: 'Rational Emotive Behavior Therapy',
    description: 'Convert self-demanding "I must / I should" dogmas into healthy desires: "I would strongly prefer to...".',
    promptGuidance: 'Trade punitive should-statements for flexible, realistic preferences.',
    counteractsEmotions: ['Frustration', 'Shame'],
  },
];

export const SEED_CONCEPTS: SeedConcept[] = [
  {
    name: 'Catastrophizing',
    category: 'Cognitive Distortion',
    description: 'Assuming the absolute worst-case scenario will occur, while simultaneously underestimating coping capacity.',
    commonThoughts: [
      'If I miss this deadline, my entire career is ruined.',
      'Everything is falling apart and there is nothing I can do.',
      'One bad review means I will get fired.',
    ],
    strategies: ['Decatastrophizing Probability Matrix', 'Circle of Control Delineation', 'Worst/Best/Most Likely Analysis'],
    triggers: ['Work & Deadlines', 'Future Uncertainty', 'Health & Physical Anxiety'],
    emotions: ['Dread', 'Anxiety', 'Overwhelm'],
  },
  {
    name: 'All-or-Nothing Thinking',
    category: 'Cognitive Distortion',
    description: 'Viewing situations in polarized, black-and-white categories; if something falls short of perfection, it is deemed a total failure.',
    commonThoughts: [
      'If it is not perfect, it is a complete waste of time.',
      'I ruined my diet with one cookie, so today is ruined.',
      'Either I succeed completely or I am a failure.',
    ],
    strategies: ['Shades of Grey Spectrum', 'Evidence-Testing Audit', 'Two-Minute Behavioral Micro-Action'],
    triggers: ['Perfectionism & Self-Doubt', 'Work & Deadlines'],
    emotions: ['Frustration', 'Shame', 'Self-Doubt'],
  },
  {
    name: 'Mind Reading',
    category: 'Cognitive Distortion',
    description: 'Assuming others are thinking negatively or judging you without verifiable facts or communication.',
    commonThoughts: [
      'They noticed my hesitation and think I do not know what I am doing.',
      'My manager did not reply with an exclamation mark, so they are angry with me.',
      'Everyone in the meeting was judging my idea.',
    ],
    strategies: ['Fact vs Feeling Separation Audit', 'Evidence-Testing Audit', 'Compassionate Friend Perspective'],
    triggers: ['Social Evaluation', 'Interpersonal Conflict'],
    emotions: ['Anxiety', 'Shame', 'Self-Doubt'],
  },
  {
    name: 'Emotional Reasoning',
    category: 'Cognitive Distortion',
    description: 'Believing that because you feel anxious, inadequate, or guilty, it must be the objective truth.',
    commonThoughts: [
      'I feel like an imposter, therefore I truly am unqualified.',
      'I feel guilty, so I must have done something wrong.',
      'I feel overwhelmed, which proves I cannot handle this project.',
    ],
    strategies: ['Fact vs Feeling Separation Audit', 'Somatic Box Breathing & Grounding', 'Cognitive Defusion'],
    triggers: ['Perfectionism & Self-Doubt', 'Overcommitment & Burnout'],
    emotions: ['Anxiety', 'Overwhelm', 'Self-Doubt'],
  },
  {
    name: 'Should Statements',
    category: 'Cognitive Distortion',
    description: 'Operating under rigid, punitive rules about how you, others, or the world ought to behave.',
    commonThoughts: [
      'I should have known better and never made that mistake.',
      'I should be much further along in life by now.',
      'I must never show signs of weakness or stress.',
    ],
    strategies: ['Preferential Reframing', 'Compassionate Friend Perspective', 'Values-Based Action Step'],
    triggers: ['Perfectionism & Self-Doubt', 'Work & Deadlines'],
    emotions: ['Shame', 'Frustration'],
  },
  {
    name: 'Imposter Syndrome',
    category: 'Cognitive Distortion',
    description: 'Persistently believing that competence is an illusion and that you will eventually be exposed as a fraud.',
    commonThoughts: [
      'I only got here because I was lucky.',
      'They will realize soon that I do not belong in this room.',
      'Anyone could have done this; it is not a real achievement.',
    ],
    strategies: ['Evidence-Testing Audit', 'Compassionate Friend Perspective', 'Values-Based Action Step'],
    triggers: ['Social Evaluation', 'Work & Deadlines', 'Perfectionism & Self-Doubt'],
    emotions: ['Anxiety', 'Self-Doubt', 'Shame'],
  },
  {
    name: 'Overgeneralization',
    category: 'Cognitive Distortion',
    description: 'Viewing a single negative event as a never-ending pattern of defeat by using words like "always" or "never".',
    commonThoughts: [
      'I always mess things up when the stakes are high.',
      'Nothing ever goes smoothly for me.',
      'I never finish what I start.',
    ],
    strategies: ['Evidence-Testing Audit', 'Shades of Grey Spectrum', 'Two-Minute Behavioral Micro-Action'],
    triggers: ['Perfectionism & Self-Doubt', 'Work & Deadlines'],
    emotions: ['Helplessness', 'Frustration'],
  },
  {
    name: 'Personalization',
    category: 'Cognitive Distortion',
    description: 'Holding yourself solely responsible for an event or person\'s mood that is largely out of your control.',
    commonThoughts: [
      'The project was delayed because I did not work hard enough.',
      'They seemed upset in the meeting—it must have been something I said.',
    ],
    strategies: ['Circle of Control Delineation', 'Fact vs Feeling Separation Audit'],
    triggers: ['Interpersonal Conflict', 'Social Evaluation'],
    emotions: ['Shame', 'Anxiety'],
  },
  {
    name: 'Mental Filtering',
    category: 'Cognitive Distortion',
    description: 'Obsessively dwelling on a single negative detail while filtering out all positive feedback or progress.',
    commonThoughts: [
      'They gave me 5 compliments, but mentioned one typo—the whole presentation sucked.',
      'I only notice the bugs, not the 95% of the codebase that works flawlessly.',
    ],
    strategies: ['Evidence-Testing Audit', 'Compassionate Friend Perspective', 'Values-Based Action Step'],
    triggers: ['Work & Deadlines', 'Perfectionism & Self-Doubt'],
    emotions: ['Frustration', 'Self-Doubt'],
  },
  {
    name: 'Fortune Telling',
    category: 'Cognitive Distortion',
    description: 'Anticipating that future events will turn out badly, treating the pessimistic hunch as an established fact.',
    commonThoughts: [
      'I already know the client will reject this proposal.',
      'This deployment is going to break production tonight.',
    ],
    strategies: ['Decatastrophizing Probability Matrix', 'Worst/Best/Most Likely Analysis', 'Two-Minute Behavioral Micro-Action'],
    triggers: ['Future Uncertainty', 'Work & Deadlines'],
    emotions: ['Dread', 'Anxiety'],
  },
];
