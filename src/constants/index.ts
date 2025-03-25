export const API = {
  BASE_URL: 'https://www.cursor.com/api',
  ENDPOINTS: {
    USAGE: '/usage',
    PREMIUM_REQUESTS: '/dashboard/get-usage-based-premium-requests',
    HARD_LIMIT: '/dashboard/get-hard-limit',
    MONTHLY_INVOICE: '/dashboard/get-monthly-invoice'
  }
} as const;

export const COLORS = {
  SUCCESS: '#16C47F',
  WARNING: '#E9B33B',
  ERROR: '#F93827',
  DISABLED: '#333333',
  TEXT: {
    PRIMARY: '#FFFFFF',
    SECONDARY: '#838383'
  }
} as const;

export const USAGE_THRESHOLDS = {
  HIGH: 95,
  MEDIUM: 75,
  LOW: 50
} as const;

export const ELEMENT_IDS = {
  REQUESTS_MADE: 'requestsMade',
  MAX_REQUESTS: 'maxRequests',
  REMAINING_REQUESTS: 'remainingRequests',
  TOKENS_USED: 'tokensUsed',
  REFRESH_BUTTON: 'refreshData',
  SETTINGS_BUTTON: 'goToSettings',
  SPINNER: 'loadingSpinner',
  ERROR_MESSAGE: 'errorMessage',
  STATS_CONTAINER: 'statsContainer',
  PROGRESS_BAR: 'requestsProgressBar',
  USAGE_BASED_REQUESTS: 'usageBasedRequests',
  USAGE_BASED_REQUESTS_STATUS: 'usageBasedRequestsStatus',
  USAGE_BASED_REQUESTS_CURRENT: 'usageBasedRequestsCurrent',
  USAGE_BASED_REQUESTS_HARD_LIMIT: 'usageBasedRequestsHardLimit',
  GITHUB_LINK: 'githubLink'
} as const;

export const MESSAGES = {
  ERRORS: {
    FETCH_STATS: 'Failed to fetch stats',
    FETCH_PREMIUM: 'Failed to fetch premium status',
    FETCH_HARD_LIMIT: 'Failed to fetch hard limit',
    FETCH_INVOICE: 'Failed to fetch monthly invoice',
    SETTINGS_BUTTON_NOT_FOUND: 'Settings button not found',
    USAGE_ELEMENT_NOT_FOUND: 'usageBasedRequestsCurrent element not found'
  },
  AUTH: {
    LOGIN_REQUIRED: 'Please login to Cursor and try again.'
  }
} as const; 