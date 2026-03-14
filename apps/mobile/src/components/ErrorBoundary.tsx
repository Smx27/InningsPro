import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import { Pressable, Text, View } from 'react-native';

import { logError } from '@services/logger';

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string | null;
};

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  public constructor(props: PropsWithChildren) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, { componentStack: errorInfo.componentStack });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-zinc-100 px-6 dark:bg-black">
          <Text className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Something went wrong
          </Text>
          <Text className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-300">
            {this.state.errorMessage ?? 'An unexpected error occurred.'}
          </Text>
          <Pressable
            onPress={this.handleReset}
            className="mt-6 h-12 min-w-40 items-center justify-center rounded-xl bg-emerald-600 px-5"
          >
            <Text className="text-base font-semibold text-white">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
