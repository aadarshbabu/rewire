export interface CognitiveDistortionItem {
  id: string;
  name: string; // e.g., "Catastrophizing", "All-or-Nothing", "Mind-Reading"
  description: string;
  detectedThought: string; // the specific extracted thought from the dump
  compassionateReframe: string; // balanced, empathetic reframe
}

export interface CircleOfControl {
  inControl: string[]; // Things user has agency over
  outsideControl: string[]; // Things external, past, or belonging to others
}

export interface ReframingAnalysis {
  summary: string;
  evolutionNote?: string; // Insights on user's journey, recurring themes, and growth over time
  recurringPatterns?: string[]; // Observed cognitive traps across past entries
  circleOfControl: CircleOfControl;
  distortions: CognitiveDistortionItem[];
  microAction: string; // Single 2-minute actionable step to regain agency
  groundingAffirmation: string; // Compassionate closing thought
}

export interface JournalEntryItem {
  id: string;
  userId: string;
  title: string | null;
  rawContent: string;
  moodBefore: number | null; // 1-10
  moodAfter: number | null; // 1-10
  distressTags: string[];
  actionTaken: "reframed" | "released" | "saved" | null;
  reframingResult: ReframingAnalysis | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
