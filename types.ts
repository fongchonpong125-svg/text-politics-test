export interface TimelinePoint {
  segmentSummary: string;
  score: number; // -100 to 100
}

export interface PoliticalAxis {
  leftScore: number; // 0-100
  rightScore: number; // 0-100
  label: string; // Stance label
}

export interface PoliticalAnalysis {
  economic: PoliticalAxis; // Equality vs Market
  diplomatic: PoliticalAxis; // Nation vs World
  civil: PoliticalAxis; // Liberty vs Authority
  societal: PoliticalAxis; // Tradition vs Progress
  ideology: string; // Overall ideology name
}

// New interface for the 7-axis analysis (LeftValues style)
export interface ExtendedPoliticalAnalysis {
  revolution: PoliticalAxis; // 革命 vs 改良
  scientific: PoliticalAxis; // 科学 vs 空想
  central: PoliticalAxis; // 集权 vs 分权
  international: PoliticalAxis; // 国际 vs 民族
  party: PoliticalAxis; // 党派 vs 工会
  production: PoliticalAxis; // 生产 vs 生态
  conservative: PoliticalAxis; // 保守 vs 进步
  closestWorldParty: string; // The real-world political party that matches this text
  closestWorldPartyReason: string; // Brief reason why this party fits
}

export interface SentimentAnalysisResult {
  overallScore: number; // -100 to 100
  sentimentLabel: string; // e.g., "Positive", "Neutral", "Negative"
  emotionalTone: string; // e.g., "Joyful", "Angry", "Melancholic"
  authorStance: string; // The perspective/identity of the author
  coreIntent: string; // What the author wants
  summary: string;
  positiveKeyPoints: string[];
  negativeKeyPoints: string[];
  suggestedResponse: string; // AI generated reply
  timeline: TimelinePoint[];
  politicalAnalysis: PoliticalAnalysis; // 8values style
  extendedPoliticalAnalysis: ExtendedPoliticalAnalysis; // New 7-axis style
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}