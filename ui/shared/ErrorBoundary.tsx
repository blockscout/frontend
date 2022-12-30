import React from 'react';

interface Props {
  children: React.ReactNode;
  renderErrorScreen: (error?: Error) => React.ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.PureComponent<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.renderErrorScreen(this.state.error);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
