import { memo } from 'react';
import { Text, View } from 'react-native';

import type { BallEvent } from '@core/database/schema';

type LastBallsRowProps = {
  balls: BallEvent[];
};

const getBallLabel = (ball: BallEvent): string => {
  if (ball.wicketType) {
    return 'W';
  }

  if (ball.extrasType === 'wide') {
    return `${ball.runs}Wd`;
  }

  if (ball.extrasType === 'noball') {
    return `${ball.runs}Nb`;
  }

  if (ball.extrasType === 'bye') {
    return `${ball.runs}B`;
  }

  if (ball.extrasType === 'legbye') {
    return `${ball.runs}Lb`;
  }

  return `${ball.runs}`;
};

export const LastBallsRow = memo(function LastBallsRow({ balls }: LastBallsRowProps) {
  const latestBalls = balls.slice(-6);

  return (
    <View>
      <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Last 6 Balls
      </Text>
      <View className="flex-row gap-2">
        {latestBalls.length === 0 ? (
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">No deliveries recorded yet.</Text>
        ) : (
          latestBalls.map((ball) => {
            const isWicket = Boolean(ball.wicketType);
            return (
              <View
                key={ball.id}
                className={`h-11 w-11 items-center justify-center rounded-full ${
                  isWicket ? 'bg-red-500' : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              >
                <Text className={`text-sm font-bold ${isWicket ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {getBallLabel(ball)}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
});
