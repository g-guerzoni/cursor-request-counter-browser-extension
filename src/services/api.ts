import { API } from '../constants.js';
import type {
  CursorAPIResponse,
  CursorStats,
  PremiumRequestsResponse,
  HardLimitResponse,
  MonthlyInvoiceResponse
} from '../types/cursor';

async function fetchJSON<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API.BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
}

export async function fetchCursorStats(): Promise<{ success: boolean; stats?: CursorStats; error?: string }> {
  try {
    const data = await fetchJSON<CursorAPIResponse>(API.ENDPOINTS.USAGE);
    const gpt4Data = data["gpt-4"];

    const stats: CursorStats = {
      requestsMade: gpt4Data.numRequests,
      maxRequests: gpt4Data.maxRequestUsage ?? 0,
      remainingRequests: (gpt4Data.maxRequestUsage ?? 0) - gpt4Data.numRequests,
      tokensUsed: gpt4Data.numTokens,
    };

    return { success: true, stats };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function fetchPremiumRequestsStatus(): Promise<{ success: boolean; isPremiumEnabled?: boolean; error?: string }> {
  try {
    const data = await fetchJSON<PremiumRequestsResponse>(API.ENDPOINTS.PREMIUM_REQUESTS, {
      method: 'POST',
      body: JSON.stringify({ teamId: 0 })
    });

    return {
      success: true,
      isPremiumEnabled: data.usageBasedPremiumRequests || false,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function fetchHardLimit(): Promise<{ success: boolean; hardLimit?: number; error?: string }> {
  try {
    const data = await fetchJSON<HardLimitResponse>(API.ENDPOINTS.HARD_LIMIT, {
      method: 'POST',
      body: JSON.stringify({})
    });

    return {
      success: true,
      hardLimit: data.hardLimit,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function fetchMonthlyInvoice(): Promise<{ success: boolean; totalCents?: number; error?: string }> {
  try {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const data = await fetchJSON<MonthlyInvoiceResponse>(API.ENDPOINTS.MONTHLY_INVOICE, {
      method: 'POST',
      body: JSON.stringify({
        month: currentMonth,
        year: currentYear,
        includeUsageEvents: false,
      })
    });

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return {
        success: true,
        totalCents: 0,
      };
    }

    const totalCents = data.items.reduce((sum, item) => {
      return sum + (typeof item.cents === "number" ? item.cents : 0);
    }, 0);

    return {
      success: true,
      totalCents,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
} 