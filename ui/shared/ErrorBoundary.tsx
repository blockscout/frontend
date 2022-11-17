import React from 'react';

interface Props {
  children: React.ReactNode;
  renderErrorScreen: () => React.ReactNode;
  onError?: (error: Error) => void;
}

class ErrorBoundary extends React.PureComponent<Props> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.renderErrorScreen();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
