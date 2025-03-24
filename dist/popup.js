"use strict";
/// <reference types="chrome"/>
function getElements() {
    return {
        requestsMade: document.getElementById("requestsMade"),
        maxRequests: document.getElementById("maxRequests"),
        remainingRequests: document.getElementById("remainingRequests"),
        tokensUsed: document.getElementById("tokensUsed"),
        refreshButton: document.getElementById("refreshData"),
        settingsButton: document.getElementById("goToSettings"),
        spinner: document.getElementById("loadingSpinner"),
        errorMessage: document.getElementById("errorMessage"),
        statsContainer: document.getElementById("statsContainer"),
        progressBar: document.getElementById("requestsProgressBar"),
    };
}
function updateStats(stats, elements) {
    if (elements.requestsMade) {
        const usagePercentage = (stats.requestsMade / stats.maxRequests) * 100;
        elements.requestsMade.textContent = stats.requestsMade.toString();
        elements.requestsMade.style.fontWeight = "bold";
        if (usagePercentage >= 95) {
            elements.requestsMade.style.color = "#F93827";
        }
        else if (usagePercentage >= 75) {
            elements.requestsMade.style.color = "#E9B33B";
        }
        else {
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
        }
        else if (usagePercentage >= 75) {
            elements.progressBar.style.backgroundColor = "#E9B33B";
        }
        else if (usagePercentage >= 50) {
            elements.progressBar.style.backgroundColor = "#16C47F";
        }
    }
}
function showError(message, elements, isAuthError = false) {
    if (elements.errorMessage) {
        if (isAuthError) {
            elements.errorMessage.innerHTML = `<p>${message}</p><p>Please <a href="https://www.cursor.com/settings" target="_blank">login to Cursor</a> and try again.</p>`;
            elements.errorMessage.style.display = "block";
        }
        else {
            elements.errorMessage.textContent = message;
            elements.errorMessage.style.display = "block";
        }
    }
}
function hideError(elements) {
    if (elements.errorMessage) {
        elements.errorMessage.style.display = "none";
    }
}
function setLoading(isLoading, elements) {
    if (elements.spinner) {
        elements.spinner.style.display = isLoading ? "block" : "none";
    }
    if (elements.refreshButton) {
        elements.refreshButton.disabled = isLoading;
    }
    if (elements.statsContainer) {
        elements.statsContainer.style.display = isLoading ? "none" : "flex";
    }
}
async function fetchStats(elements) {
    setLoading(true, elements);
    hideError(elements);
    try {
        const response = await chrome.runtime.sendMessage({ action: "fetchStats" });
        if (response.success && response.stats) {
            updateStats(response.stats, elements);
            hideError(elements);
        }
        else {
            const isAuthError = response.error?.includes("401") || response.error?.includes("unauthorized");
            showError(response.error || "Failed to fetch stats", elements, isAuthError);
        }
    }
    catch (error) {
        showError("Failed to fetch stats", elements);
    }
    finally {
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
    document.getElementById("githubLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target instanceof HTMLAnchorElement) {
            chrome.tabs.create({ url: e.target.href });
        }
    });
    await fetchStats(elements);
});
