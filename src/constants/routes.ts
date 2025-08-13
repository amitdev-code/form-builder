// Public routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP: '/verify-otp',
  ONBOARDING: '/onboarding',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  PRICING: '/pricing',
  FEATURES: '/features',
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
} as const;

// Protected routes
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  BILLING: '/billing',
  TEAM: '/team',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  INTEGRATIONS: '/integrations',
  API_KEYS: '/api-keys',
  WEBHOOKS: '/webhooks',
  LOGS: '/logs',
  ADMIN: '/admin',
} as const;

// Admin routes
export const ADMIN_ROUTES = {
  USERS: '/admin/users',
  ORGANIZATIONS: '/admin/organizations',
  SYSTEM_LOGS: '/admin/logs',
  SETTINGS: '/admin/settings',
  BILLING: '/admin/billing',
} as const;

// Error routes
export const ERROR_ROUTES = {
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403',
  SERVER_ERROR: '/500',
  MAINTENANCE: '/maintenance',
} as const;

// All routes combined
export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
  ...ADMIN_ROUTES,
  ...ERROR_ROUTES,
} as const; 