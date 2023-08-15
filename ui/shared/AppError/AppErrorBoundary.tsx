import { chakra } from '@chakra-ui/react';
import React from 'react';

import ErrorBoundary from 'ui/shared/ErrorBoundary';

import AppError from './AppError';

interface Props {
  className?: string;
  children: React.ReactNode;
  onError?: (error: Error) => void;
}

const AppErrorBoundary = ({ className, children, onError }: Props) => {

  const renderErrorScreen = React.useCallback((error?: Error) => {
    return <AppError error={ error } className={ className }/>;
  }, [ className ]);

  return (
    <ErrorBoundary renderErrorScreen={ renderErrorScreen } onError={ onError }>
      { children }
    </ErrorBoundary>
  );
};

export default React.memo(chakra(AppErrorBoundary));
