/// <reference types="chrome"/>

interface GPTUsage {
  numRequests: number;
  numRequestsTotal: number;
  numTokens: number;
  maxRequestUsage: number | null;
  maxTokenUsage: number | null;
}

interface CursorAPIResponse {
  "gpt-4": GPTUsage;
  "gpt-3.5-turbo": GPTUsage;
  "gpt-4-32k": GPTUsage;
  startOfMonth: string;
}

interface CursorStats {
  requestsMade: number;
  maxRequests: number;
  remainingRequests: number;
  tokensUsed: number;
}

interface PremiumRequestsResponse {
  usageBasedPremiumRequests?: boolean;
}

interface HardLimitResponse {
  hardLimit: number;
}

interface InvoiceItem {
  description: string;
  cents: number;
}

interface MonthlyInvoiceResponse {
  items: InvoiceItem[];
  pricingDescription: {
    description: string;
    id: string;
  };
  usageEvents: any[];
  isUsageEventsMaybeCutoff: boolean;
}

async function fetchCursorStats(): Promise<{ success: boolean; stats?: CursorStats; error?: string }> {
  try {
    const response = await fetch("https://www.cursor.com/api/usage");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = (await response.json()) as CursorAPIResponse;

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

async function fetchPremiumRequestsStatus(): Promise<{ success: boolean; isPremiumEnabled?: boolean; error?: string }> {
  try {
    const response = await fetch("https://www.cursor.com/api/dashboard/get-usage-based-premium-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamId: 0 }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = (await response.json()) as PremiumRequestsResponse;
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

async function fetchHardLimit(): Promise<{ success: boolean; hardLimit?: number; error?: string }> {
  try {
    const response = await fetch("https://www.cursor.com/api/dashboard/get-hard-limit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = (await response.json()) as HardLimitResponse;
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

async function fetchMonthlyInvoice(): Promise<{ success: boolean; totalCents?: number; error?: string }> {
  try {
    let response = await fetch("https://www.cursor.com/api/dashboard/get-monthly-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        month: 2,
        year: 2025,
        includeUsageEvents: true,
      }),
    });

    if (!response.ok) {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      response = await fetch("https://www.cursor.com/api/dashboard/get-monthly-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: currentMonth,
          year: currentYear,
          includeUsageEvents: true,
        }),
      });
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = (await response.json()) as MonthlyInvoiceResponse;

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
    console.error("Error fetching monthly invoice:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchStats") {
    fetchCursorStats().then(sendResponse);
    return true;
  }

  if (request.action === "fetchPremiumStatus") {
    fetchPremiumRequestsStatus().then(sendResponse);
    return true;
  }

  if (request.action === "fetchHardLimit") {
    fetchHardLimit().then(sendResponse);
    return true;
  }

  if (request.action === "fetchMonthlyInvoice") {
    fetchMonthlyInvoice().then(sendResponse);
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.includes("cursor.com/settings")) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        const statsResult = await fetchCursorStats();
        if (statsResult.success && statsResult.stats) {
          chrome.storage.local.set({ cursorStats: statsResult.stats });
        }

        const premiumResult = await fetchPremiumRequestsStatus();
        if (premiumResult.success) {
          chrome.storage.local.set({ premiumStatus: premiumResult.isPremiumEnabled });

          if (premiumResult.isPremiumEnabled) {
            const hardLimitResult = await fetchHardLimit();
            if (hardLimitResult.success && hardLimitResult.hardLimit) {
              chrome.storage.local.set({ hardLimit: hardLimitResult.hardLimit });
            }

            const invoiceResult = await fetchMonthlyInvoice();
            if (invoiceResult.success && invoiceResult.totalCents !== undefined) {
              chrome.storage.local.set({ totalCents: invoiceResult.totalCents });
            }
          }
        }
      },
    });
  }
});
