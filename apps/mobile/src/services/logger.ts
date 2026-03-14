const formatMessage = (message: string): string => {
  return `[InningsPro] ${message}`;
};

const serializeUnknown = (value: unknown): unknown => {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  return value;
};

export const logInfo = (message: string, context?: Record<string, unknown>): void => {
  console.info(formatMessage(message), {
    context,
    timestamp: new Date().toISOString(),
  });
};

export const logError = (error: unknown, context?: Record<string, unknown>): void => {
  console.error(formatMessage('Error captured'), {
    error: serializeUnknown(error),
    context,
    timestamp: new Date().toISOString(),
  });
};

export const logMatchEvent = (event: {
  type: 'run' | 'boundary' | 'wicket' | 'extra' | 'undo';
  matchId: string;
  payload?: Record<string, unknown>;
}): void => {
  console.info(formatMessage('Match event'), {
    ...event,
    timestamp: new Date().toISOString(),
  });
};
