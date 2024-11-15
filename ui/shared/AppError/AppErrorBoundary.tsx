import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useRollbar } from 'lib/rollbar';
import ErrorBoundary from 'ui/shared/ErrorBoundary';

import AppError from './AppError';

interface Props {
  className?: string;
  children: React.ReactNode;
  Container?: React.FC<{ children: React.ReactNode }>;
}

const AppErrorBoundary = ({ className, children, Container }: Props) => {

  const rollbar = useRollbar();

  const renderErrorScreen = React.useCallback((error?: Error) => {
    const content = <AppError error={ error } className={ className }/>;
    if (Container) {
      return <Container>{ content }</Container>;
    }
    return content;
  }, [ className, Container ]);

  const handleError = React.useCallback((error: Error) => {
    rollbar?.error(error);
  }, [ rollbar ]);

  return (
    <ErrorBoundary renderErrorScreen={ renderErrorScreen } onError={ handleError }>
      { children }
    </ErrorBoundary>
  );
};

export default React.memo(chakra(AppErrorBoundary));
