/// <reference types="chrome"/>

import { COLORS, ELEMENT_IDS, MESSAGES } from './constants.js';
import type { CursorStats, DOMElements } from './types/cursor';
import {
  getElements,
  setElementDisplay,
  setElementText,
  setElementColor,
  getColorByUsagePercentage,
  formatDollars,
  setProgressBarStyle
} from './utils/dom.js';

function updateStats(stats: CursorStats, elements: DOMElements): void {
  const usagePercentage = (stats.requestsMade / stats.maxRequests) * 100;

  if (elements.requestsMade) {
    setElementText(elements.requestsMade, stats.requestsMade.toString());
    elements.requestsMade.style.fontWeight = 'bold';
    setElementColor(elements.requestsMade, getColorByUsagePercentage(usagePercentage));
  }

  setElementText(elements.maxRequests, stats.maxRequests.toString());
  setElementText(elements.remainingRequests, stats.remainingRequests.toString());
  setElementText(elements.tokensUsed, stats.tokensUsed.toLocaleString());

  if (elements.progressBar && stats.maxRequests > 0) {
    setProgressBarStyle(elements.progressBar, usagePercentage);
  }
}

function showPremiumStatus(isPremiumEnabled: boolean, elements: DOMElements): void {
  setElementDisplay(elements.usageBasedRequests, isPremiumEnabled ? "block" : "none");
  
  if (elements.usageBasedRequestsStatus) {
    if (isPremiumEnabled) {
      setElementText(elements.usageBasedRequestsStatus, "On");
      setElementColor(elements.usageBasedRequestsStatus, COLORS.SUCCESS);
      elements.usageBasedRequestsStatus.style.fontWeight = "bold";
      
      fetchAndDisplayHardLimit(elements)
        .then(() => fetchAndDisplayMonthlyInvoice(elements))
        .catch(err => {
          console.error(MESSAGES.ERRORS.FETCH_PREMIUM, err);
        });
      
    } else {
      setElementText(elements.usageBasedRequestsStatus, "Off");
      setElementColor(elements.usageBasedRequestsStatus, COLORS.ERROR);
      elements.usageBasedRequestsStatus.style.fontWeight = "bold";
    }
  }
}

function updateHardLimit(hardLimit: number, elements: DOMElements): void {
  setElementText(elements.usageBasedRequestsHardLimit, formatDollars(hardLimit * 100));
}

function updateCurrentUsage(totalCents: number, elements: DOMElements): void {
  if (elements.usageBasedRequestsCurrent) {
    const cents = typeof totalCents === 'number' ? totalCents : 0;
    setElementText(elements.usageBasedRequestsCurrent, formatDollars(cents));
    
    if (elements.usageBasedRequestsHardLimit) {
      const hardLimitText = elements.usageBasedRequestsHardLimit.textContent;
      if (hardLimitText && hardLimitText.startsWith('$')) {
        const hardLimitValue = parseFloat(hardLimitText.substring(1));
        const currentValue = cents / 100;
        
        if (!isNaN(hardLimitValue) && !isNaN(currentValue) && hardLimitValue > 0) {
          const usagePercentage = (currentValue / hardLimitValue) * 100;
          
          elements.usageBasedRequestsCurrent.style.fontWeight = 'bold';
          setElementColor(elements.usageBasedRequestsCurrent, getColorByUsagePercentage(usagePercentage));
        }
      }
    }
  } else {
    console.error(MESSAGES.ERRORS.USAGE_ELEMENT_NOT_FOUND);
  }
}

function showError(message: string, elements: DOMElements, isAuthError: boolean = false): void {
  if (elements.errorMessage) {
    if (isAuthError) {
      elements.errorMessage.innerHTML = `<p>${message}</p><p>${MESSAGES.AUTH.LOGIN_REQUIRED}</p>`;
      setElementDisplay(elements.errorMessage, "block");
    } else {
      setElementText(elements.errorMessage, message);
      setElementDisplay(elements.errorMessage, "block");
    }
  }
}

function hideError(elements: DOMElements): void {
  setElementDisplay(elements.errorMessage, "none");
}

function setLoading(isLoading: boolean, elements: DOMElements): void {
  setElementDisplay(elements.spinner, isLoading ? "block" : "none");
  if (elements.refreshButton) {
    elements.refreshButton.disabled = isLoading;
  }
  setElementDisplay(elements.statsContainer, isLoading ? "none" : "flex");
  setElementDisplay(elements.usageBasedRequests, isLoading ? "none" : "block");
}

async function fetchAndDisplayHardLimit(elements: DOMElements): Promise<void> {
  try {
    const response = await chrome.runtime.sendMessage({ action: "fetchHardLimit" });
    if (response.success && response.hardLimit) {
      updateHardLimit(response.hardLimit, elements);
    }
  } catch (error) {
    console.error(MESSAGES.ERRORS.FETCH_HARD_LIMIT, error);
  }
}

async function fetchAndDisplayMonthlyInvoice(elements: DOMElements): Promise<void> {
  try {
    const response = await chrome.runtime.sendMessage({ action: "fetchMonthlyInvoice" });
    if (response.success && response.totalCents !== undefined) {
      updateCurrentUsage(response.totalCents, elements);
    } else {
      console.error('Failed to get valid response from fetchMonthlyInvoice', response);
    }
  } catch (error) {
    console.error(MESSAGES.ERRORS.FETCH_INVOICE, error);
  }
}

async function fetchPremiumStatus(elements: DOMElements): Promise<boolean> {
  try {
    const response = await chrome.runtime.sendMessage({ action: "fetchPremiumStatus" });
    if (response.success) {
      const isPremiumEnabled = response.isPremiumEnabled || false;
      showPremiumStatus(isPremiumEnabled, elements);
      return isPremiumEnabled;
    }
  } catch (error) {
    console.error(MESSAGES.ERRORS.FETCH_PREMIUM, error);
  }
  return false;
}

async function fetchStats(elements: DOMElements): Promise<void> {
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
      showError(response.error || MESSAGES.ERRORS.FETCH_STATS, elements, isAuthError);
    }
  } catch (error) {
    showError(MESSAGES.ERRORS.FETCH_STATS, elements);
  } finally {
    setLoading(false, elements);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const elements = getElements();

  if (!elements.settingsButton) {
    console.error(MESSAGES.ERRORS.SETTINGS_BUTTON_NOT_FOUND);
    return;
  }

  elements.settingsButton.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://www.cursor.com/settings" });
  });

  if (elements.refreshButton) {
    elements.refreshButton.addEventListener("click", () => fetchStats(elements));
  }

  document.getElementById(ELEMENT_IDS.GITHUB_LINK)?.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target instanceof HTMLAnchorElement) {
      chrome.tabs.create({ url: e.target.href });
    }
  });

  if (elements.usageBasedRequests) {
    setElementDisplay(elements.usageBasedRequests, "none");
  }

  await fetchStats(elements);
});
