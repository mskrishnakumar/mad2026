// ============================================
// HACKATHON STARTER - Type Definitions
// Adapt these types to your specific domain
// ============================================

// --- User Profile Types ---
export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  // Add domain-specific fields:
  // education?: EducationLevel;
  // skills?: string[];
  // preferences?: UserPreferences;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Item/Entity Types (e.g., Career, Scholarship, Product) ---
export interface Item {
  id: string;
  name: string;
  description: string;
  // Add domain-specific fields:
  // requirements?: string[];
  // category?: string;
  // tags?: string[];
}

// --- Recommendation Types ---
export interface Recommendation {
  item: Item;
  score: number;
  scoreBreakdown?: ScoreBreakdown;
}

export interface ScoreBreakdown {
  // Rule-based scores
  eligibilityScore?: number;
  // Semantic/AI scores
  semanticScore?: number;
  // Add domain-specific scores:
  // skillMatch?: number;
  // preferenceMatch?: number;
}

// --- Chat Types ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

export interface ChatContext {
  userProfile?: UserProfile;
  relevantItems?: Item[];
  conversationHistory?: ChatMessage[];
}

// --- API Response Types ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// --- Embedding Types ---
export interface Embedding {
  id: string;
  vector: number[];
}

export interface SimilarityResult {
  id: string;
  score: number;
}

// --- Guided Flow / Onboarding Types ---
export interface GuidedFlowStep {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text' | 'number';
  options?: GuidedFlowOption[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface GuidedFlowOption {
  value: string;
  label: string;
  description?: string;
}

export interface GuidedFlowResponse {
  stepId: string;
  value: string | string[] | number;
}

// --- Enums (customize for your domain) ---
export enum EducationLevel {
  HIGH_SCHOOL = 'high_school',
  ASSOCIATE = 'associate',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd',
  OTHER = 'other',
}

// --- Utility Types ---
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
