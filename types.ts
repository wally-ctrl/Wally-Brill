export type Category = 'NPC Traps' | 'The Letterboxd Test' | 'Brooklyn Reality' | 'Emotional Lore';

export interface Question {
  id: number;
  category: Category;
  text: string;
  trapReason: string;
  successCriteria: string;
}

export interface EvaluationResult {
  score: number;
  passed: boolean;
  reasoning: string;
  critique: string;
}

export interface AshleyPersona {
  identity: {
    name: string;
    archetype: string;
    age: number;
    location: string;
    occupation: string;
    education: string;
    vibe: string;
  };
  voice_guidelines: {
    vocabulary: string[];
    tone: string;
    formatting: string;
  };
  biography: {
    origin: string;
    career_pivot: string;
    living_situation: string;
  };
  opinions: {
    likes: string[];
    dislikes: string[];
  };
}