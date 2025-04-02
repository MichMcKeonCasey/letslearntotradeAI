// /home/project/agents/types.ts

/**
 * Represents the input for the AI agent system.
 */
export interface AgentSystemInput {
  userQuery: string; // The user's search query (e.g., "how to start day trading")
  targetAudience?: string; // e.g., "beginner", "intermediate"
  // Add other relevant context if needed
}

/**
 * Represents the output structure of a single content piece.
 */
export interface ContentPiece {
  id: string;
  type: 'article' | 'guide' | 'faq' | 'glossary' | 'interactive_module';
  title: string;
  seoTitle: string;
  metaDescription: string;
  slug: string; // URL-friendly identifier
  keywords: string[];
  contentOutline: string[]; // High-level structure
  body: string; // Main content (potentially structured, e.g., markdown or JSON)
  interactiveElements?: any[]; // Placeholder for quizzes, calculators, etc.
  citations: { source: string; description: string }[];
  disclaimers: string[];
  trustSignals: string[]; // e.g., "Fact-checked by FinancialAnalystAgent"
  engagementScore?: number; // Estimated engagement level
  seoScore?: number; // Estimated SEO quality
  trustScore?: number; // Estimated trustworthiness
  lastUpdated: string; // ISO date string
  relatedContentIds?: string[]; // Links to other relevant content pieces
}

/**
 * Represents the final output of the AI agent system for a given query.
 */
export interface AgentSystemOutput {
  queryAnalysis: {
    intent: string;
    keyTopics: string[];
  };
  mainContent: ContentPiece;
  suggestedFollowUps?: Pick<ContentPiece, 'id' | 'title' | 'slug'>[]; // Links to related content
  generationMetadata: {
    agentsInvolved: string[];
    processingTimeMs: number;
    timestamp: string;
  };
}

/**
 * Base interface for an AI Agent.
 */
export interface AIAgent<Input, Output> {
  name: string;
  description: string;
  process: (input: Input, context?: any) => Promise<Output>;
}

// Example specific agent input/output types (can be refined later)
export interface ContentStrategyInput {
  userQuery: string;
  targetAudience?: string;
}

export interface ContentStrategyOutput {
  intent: string;
  keyTopics: string[];
  proposedTitle: string;
  contentOutline: string[];
  contentType: ContentPiece['type'];
  keywords: string[];
}

export interface FinancialAnalysisInput {
  topics: string[];
  outline: string[];
  // Potentially specific questions or data points needed
}

export interface FinancialAnalysisOutput {
  factualData: Record<string, any>; // Key-value store of facts, definitions, examples
  analysisSnippets: string[]; // Pre-written paragraphs or explanations
  identifiedRisks: string[];
}

// ... (Define interfaces for other agents: Engagement, SEO, Trust)

export interface OrchestratorInput extends AgentSystemInput {}
export interface OrchestratorOutput extends AgentSystemOutput {}
