/// <reference types="chrome"/>

import {
  fetchCursorStats,
  fetchPremiumRequestsStatus,
  fetchHardLimit,
  fetchMonthlyInvoice
} from './services/api.js';

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
    updateCursorData();
  }
});

async function updateCursorData() {
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
}
