/// <reference types="chrome"/>

export interface GPTUsage {
  numRequests: number;
  numRequestsTotal: number;
  numTokens: number;
  maxRequestUsage: number | null;
  maxTokenUsage: number | null;
}

export interface CursorAPIResponse {
  "gpt-4": GPTUsage;
  "gpt-3.5-turbo": GPTUsage;
  "gpt-4-32k": GPTUsage;
  startOfMonth: string;
}

export interface CursorStats {
  requestsMade: number;
  maxRequests: number;
  remainingRequests: number;
  tokensUsed: number;
}

export interface PremiumRequestsResponse {
  usageBasedPremiumRequests?: boolean;
}

export interface HardLimitResponse {
  hardLimit: number;
}

export interface InvoiceItem {
  description: string;
  cents: number;
}

export interface MonthlyInvoiceResponse {
  items: InvoiceItem[];
  pricingDescription: {
    description: string;
    id: string;
  };
  usageEvents: any[];
  isUsageEventsMaybeCutoff: boolean;
}

export interface DOMElements {
  requestsMade: HTMLElement | null;
  maxRequests: HTMLElement | null;
  remainingRequests: HTMLElement | null;
  tokensUsed: HTMLElement | null;
  refreshButton: HTMLButtonElement | null;
  settingsButton: HTMLButtonElement | null;
  spinner: HTMLElement | null;
  errorMessage: HTMLElement | null;
  statsContainer: HTMLElement | null;
  progressBar: HTMLElement | null;
  usageBasedRequests: HTMLElement | null;
  usageBasedRequestsStatus: HTMLElement | null;
  usageBasedRequestsCurrent: HTMLElement | null;
  usageBasedRequestsHardLimit: HTMLElement | null;
} 