import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Text, YStack } from 'tamagui';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <YStack flex={1} items="center" justify="center" p="$4" gap="$3">
          <Text fontSize={18} fontWeight="600" color="$red10">
            Algo deu errado
          </Text>
          <Text fontSize={14} color="$textMuted" style={{ textAlign: 'center' }}>
            Recarregue a página para tentar novamente.
          </Text>
          {__DEV__ && this.state.error && (
            <Text fontSize={12} color="$red8" style={{ textAlign: 'center', fontFamily: 'monospace' }}>
              {this.state.error.message}
            </Text>
          )}
        </YStack>
      );
    }

    return this.props.children;
  }
}