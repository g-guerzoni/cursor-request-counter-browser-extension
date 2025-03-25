/// <reference types="chrome"/>

interface CursorStats {
  requestsMade: number;
  maxRequests: number;
  remainingRequests: number;
  tokensUsed: number;
}

interface Elements {
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

function getElements(): Elements {
  return {
    requestsMade: document.getElementById("requestsMade"),
    maxRequests: document.getElementById("maxRequests"),
    remainingRequests: document.getElementById("remainingRequests"),
    tokensUsed: document.getElementById("tokensUsed"),
    refreshButton: document.getElementById("refreshData") as HTMLButtonElement,
    settingsButton: document.getElementById("goToSettings") as HTMLButtonElement,
    spinner: document.getElementById("loadingSpinner"),
    errorMessage: document.getElementById("errorMessage"),
    statsContainer: document.getElementById("statsContainer"),
    progressBar: document.getElementById("requestsProgressBar"),
    usageBasedRequests: document.getElementById("usageBasedRequests"),
    usageBasedRequestsStatus: document.getElementById("usageBasedRequestsStatus"),
    usageBasedRequestsCurrent: document.getElementById("usageBasedRequestsCurrent"),
    usageBasedRequestsHardLimit: document.getElementById("usageBasedRequestsHardLimit"),
  };
}

function updateStats(stats: CursorStats, elements: Elements): void {
  if (elements.requestsMade) {
    const usagePercentage = (stats.requestsMade / stats.maxRequests) * 100;
    elements.requestsMade.textContent = stats.requestsMade.toString();
    elements.requestsMade.style.fontWeight = 'bold';

    if (usagePercentage >= 95) {
      elements.requestsMade.style.color = "#F93827";
    } else if (usagePercentage >= 75) {
      elements.requestsMade.style.color = "#E9B33B";
    } else {
      elements.requestsMade.style.color = "#16C47F";
    }
  }
  if (elements.maxRequests) {
    elements.maxRequests.textContent = stats.maxRequests.toString();
  }
  if (elements.remainingRequests) {
    elements.remainingRequests.textContent = stats.remainingRequests.toString();
  }
  if (elements.tokensUsed) {
    elements.tokensUsed.textContent = stats.tokensUsed.toLocaleString();
  }
  if (elements.progressBar && stats.maxRequests > 0) {
    const percentage = ((stats.requestsMade / stats.maxRequests) * 100).toFixed(1);
    elements.progressBar.style.width = `${percentage}%`;
    
    const usagePercentage = parseFloat(percentage);
    if (usagePercentage >= 95) {
      elements.progressBar.style.backgroundColor = "#F93827";
    } else if (usagePercentage >= 75) {
      elements.progressBar.style.backgroundColor = "#E9B33B";
    } else if (usagePercentage >= 50) {
      elements.progressBar.style.backgroundColor = "#16C47F";
    }
  }
}

function showPremiumStatus(isPremiumEnabled: boolean, elements: Elements): void {
  if (elements.usageBasedRequests) {
    elements.usageBasedRequests.style.display = isPremiumEnabled ? "block" : "none";
  }
  
  if (elements.usageBasedRequestsStatus) {
    if (isPremiumEnabled) {
      elements.usageBasedRequestsStatus.textContent = "On";
      elements.usageBasedRequestsStatus.style.color = "#16C47F";
      elements.usageBasedRequestsStatus.style.fontWeight = "bold";
      
      fetchAndDisplayHardLimit(elements)
        .then(() => fetchAndDisplayMonthlyInvoice(elements))
        .catch(err => {
          console.error('Error fetching premium data:', err);
        });
      
    } else {
      elements.usageBasedRequestsStatus.textContent = "Off";
      elements.usageBasedRequestsStatus.style.color = "#F93827"; 
      elements.usageBasedRequestsStatus.style.fontWeight = "bold";
    }
  }
}

function updateHardLimit(hardLimit: number, elements: Elements): void {
  if (elements.usageBasedRequestsHardLimit) {
    elements.usageBasedRequestsHardLimit.textContent = `$${hardLimit.toString()}`;
  }
}

function updateCurrentUsage(totalCents: number, elements: Elements): void {
  if (elements.usageBasedRequestsCurrent) {
    const dollars = (totalCents / 100).toFixed(2);
    elements.usageBasedRequestsCurrent.textContent = `$${dollars}`;
    
    if (elements.usageBasedRequestsHardLimit) {
      const hardLimitText = elements.usageBasedRequestsHardLimit.textContent;
      if (hardLimitText && hardLimitText.startsWith('$')) {
        const hardLimitValue = parseFloat(hardLimitText.substring(1));
        const currentValue = parseFloat(dollars);
        
        if (!isNaN(hardLimitValue) && !isNaN(currentValue) && hardLimitValue > 0) {
          const usagePercentage = (currentValue / hardLimitValue) * 100;
          
          elements.usageBasedRequestsCurrent.style.fontWeight = 'bold';
          
          if (usagePercentage >= 95) {
            elements.usageBasedRequestsCurrent.style.color = "#F93827";
          } else if (usagePercentage >= 75) {
            elements.usageBasedRequestsCurrent.style.color = "#E9B33B";
          } else if (usagePercentage >= 50) {
            elements.usageBasedRequestsCurrent.style.color = "#16C47F";
          } else {
            elements.usageBasedRequestsCurrent.style.color = "#16C47F";
          }
        }
      }
    }
  } else {
    console.error('usageBasedRequestsCurrent element not found');
  }
}

function showError(message: string, elements: Elements, isAuthError: boolean = false): void {
  if (elements.errorMessage) {
    if (isAuthError) {
      elements.errorMessage.innerHTML = `<p>${message}</p><p>Please <a href="https://www.cursor.com/settings" target="_blank">login to Cursor</a> and try again.</p>`;
      elements.errorMessage.style.display = "block";
    } else {
      elements.errorMessage.textContent = message;
      elements.errorMessage.style.display = "block";
    }
  }
}

function hideError(elements: Elements): void {
  if (elements.errorMessage) {
    elements.errorMessage.style.display = "none";
  }
}

function setLoading(isLoading: boolean, elements: Elements): void {
  if (elements.spinner) {
    elements.spinner.style.display = isLoading ? "block" : "none";
  }
  if (elements.refreshButton) {
    elements.refreshButton.disabled = isLoading;
  }
  if (elements.statsContainer) {
    elements.statsContainer.style.display = isLoading ? "none" : "flex";
  }
  if (elements.usageBasedRequests) {
    elements.usageBasedRequests.style.display = isLoading ? "none" : "block";
  }
}

async function fetchAndDisplayHardLimit(elements: Elements): Promise<void> {
  try {
    const response = await chrome.runtime.sendMessage({ action: "fetchHardLimit" });
    if (response.success && response.hardLimit) {
      updateHardLimit(response.hardLimit, elements);
    }
  } catch (error) {
    console.error("Failed to fetch hard limit", error);
  }
}

async function fetchAndDisplayMonthlyInvoice(elements: Elements): Promise<void> {
  try {
    const response = await chrome.runtime.sendMessage({ action: "fetchMonthlyInvoice" });
    if (response.success && response.totalCents !== undefined) {
      updateCurrentUsage(response.totalCents, elements);
    } else {
      console.error('Failed to get valid response from fetchMonthlyInvoice', response);
    }
  } catch (error) {
    console.error("Failed to fetch monthly invoice", error);
  }
}

async function fetchPremiumStatus(elements: Elements): Promise<boolean> {
  try {
    const response = await chrome.runtime.sendMessage({ action: "fetchPremiumStatus" });
    if (response.success) {
      const isPremiumEnabled = response.isPremiumEnabled || false;
      showPremiumStatus(isPremiumEnabled, elements);
      return isPremiumEnabled;
    }
  } catch (error) {
    console.error("Failed to fetch premium status", error);
  }
  return false;
}

async function fetchStats(elements: Elements): Promise<void> {
  setLoading(true, elements);
  hideError(elements);

  try {
    const response = await chrome.runtime.sendMessage({ action: "fetchStats" });
    if (response.success && response.stats) {
      updateStats(response.stats, elements);
      hideError(elements);
      
      await fetchPremiumStatus(elements);
    } else {
      const isAuthError = response.error?.includes("401") || response.error?.includes("unauthorized");
      showError(response.error || "Failed to fetch stats", elements, isAuthError);
    }
  } catch (error) {
    showError("Failed to fetch stats", elements);
  } finally {
    setLoading(false, elements);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const elements = getElements();

  if (!elements.settingsButton) {
    console.error("Settings button not found");
    return;
  }

  elements.settingsButton.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://www.cursor.com/settings" });
  });

  if (elements.refreshButton) {
    elements.refreshButton.addEventListener("click", () => fetchStats(elements));
  }

  document.getElementById('githubLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target instanceof HTMLAnchorElement) {
      chrome.tabs.create({ url: e.target.href });
    }
  });

  if (elements.usageBasedRequests) {
    elements.usageBasedRequests.style.display = "none";
  }

  await fetchStats(elements);
});
