import { chakra } from '@chakra-ui/react';
import React from 'react';

import ErrorBoundary from 'ui/shared/ErrorBoundary';

import AppError from './AppError';

interface Props {
  className?: string;
  children: React.ReactNode;
  onError?: (error: Error) => void;
  Container?: React.FC<{ children: React.ReactNode }>;
}

const AppErrorBoundary = ({ className, children, onError, Container }: Props) => {

  const renderErrorScreen = React.useCallback((error?: Error) => {
    const content = <AppError error={ error } className={ className }/>;
    if (Container) {
      return <Container>{ content }</Container>;
    }
    return content;
  }, [ className, Container ]);

  return (
    <ErrorBoundary renderErrorScreen={ renderErrorScreen } onError={ onError }>
      { children }
    </ErrorBoundary>
  );
};

export default React.memo(chakra(AppErrorBoundary));
