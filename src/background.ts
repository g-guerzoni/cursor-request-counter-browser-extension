/// <reference types="chrome"/>

interface GPTUsage {
  numRequests: number;
  numRequestsTotal: number;
  numTokens: number;
  maxRequestUsage: number | null;
  maxTokenUsage: number | null;
}

interface CursorAPIResponse {
  'gpt-4': GPTUsage;
  'gpt-3.5-turbo': GPTUsage;
  'gpt-4-32k': GPTUsage;
  startOfMonth: string;
}

interface CursorStats {
  requestsMade: number;
  maxRequests: number;
  remainingRequests: number;
  tokensUsed: number;
}

async function fetchCursorStats(): Promise<{ success: boolean; stats?: CursorStats; error?: string }> {
  try {
    const response = await fetch('https://www.cursor.com/api/usage');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json() as CursorAPIResponse;
    
    const gpt4Data = data['gpt-4'];
    const stats: CursorStats = {
      requestsMade: gpt4Data.numRequestsTotal,
      maxRequests: gpt4Data.maxRequestUsage ?? 0,
      remainingRequests: (gpt4Data.maxRequestUsage ?? 0) - gpt4Data.numRequestsTotal,
      tokensUsed: gpt4Data.numTokens
    };
    
    return { success: true, stats };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchStats') {
    fetchCursorStats().then(sendResponse);
    return true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('cursor.com/settings')) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        const result = await fetchCursorStats();
        if (result.success && result.stats) {
          chrome.storage.local.set({ cursorStats: result.stats });
        }
      }
    });
  }
}); 