/**
 * Centralized logging utility for the mobile application.
 * Currently logs to console, but can be integrated with Sentry or other monitoring services.
 */
export const logError = (error: unknown, context?: Record<string, unknown>): void => {
  // In a production environment, this would also send to an error tracking service like Sentry
  // as documented in docs/DEPLOYMENT.md

  console.error('[DatabaseError]', {
    error,
    context,
    timestamp: new Date().toISOString(),
  });
};
