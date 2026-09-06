export interface Memory {
  id: string;
  title: string;
  summary: string;
  moodLabel: string;
  themes: string[];
  createdAt: string;
  bookColor: string;
  bookHeight?: number;
  companionReaction?: string;
}

export interface InsightResponse {
  era?: {
    eraName: string;
    description: string;
    whatIsShifting: string;
  };
  connectTheDots?: {
    found: boolean;
    pattern: string;
  };
  [key: string]: any;
}
