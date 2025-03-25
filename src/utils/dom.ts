import { COLORS, USAGE_THRESHOLDS } from '../constants.js';
import type { DOMElements } from '../types/cursor';

export function getElements(): DOMElements {
  const getElementById = (id: string) => document.getElementById(id);
  const getButtonById = (id: string) => getElementById(id) as HTMLButtonElement;

  return {
    requestsMade: getElementById('requestsMade'),
    maxRequests: getElementById('maxRequests'),
    remainingRequests: getElementById('remainingRequests'),
    tokensUsed: getElementById('tokensUsed'),
    refreshButton: getButtonById('refreshData'),
    settingsButton: getButtonById('goToSettings'),
    spinner: getElementById('loadingSpinner'),
    errorMessage: getElementById('errorMessage'),
    statsContainer: getElementById('statsContainer'),
    progressBar: getElementById('requestsProgressBar'),
    usageBasedRequests: getElementById('usageBasedRequests'),
    usageBasedRequestsStatus: getElementById('usageBasedRequestsStatus'),
    usageBasedRequestsCurrent: getElementById('usageBasedRequestsCurrent'),
    usageBasedRequestsHardLimit: getElementById('usageBasedRequestsHardLimit'),
  };
}

export function setElementDisplay(element: HTMLElement | null, display: string): void {
  if (element) {
    element.style.display = display;
  }
}

export function setElementText(element: HTMLElement | null, text: string): void {
  if (element) {
    element.textContent = text;
  }
}

export function setElementColor(element: HTMLElement | null, color: string): void {
  if (element) {
    element.style.color = color;
  }
}

export function getColorByUsagePercentage(percentage: number): string {
  if (percentage >= USAGE_THRESHOLDS.HIGH) {
    return COLORS.ERROR;
  }
  if (percentage >= USAGE_THRESHOLDS.MEDIUM) {
    return COLORS.WARNING;
  }
  return COLORS.SUCCESS;
}

export function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function setProgressBarStyle(
  progressBar: HTMLElement | null,
  percentage: number
): void {
  if (!progressBar) return;

  progressBar.style.width = `${percentage}%`;
  progressBar.style.backgroundColor = getColorByUsagePercentage(percentage);
} 