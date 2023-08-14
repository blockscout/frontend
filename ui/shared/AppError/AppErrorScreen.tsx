import React from 'react';

import getErrorCauseStatusCode from 'lib/errors/getErrorCauseStatusCode';
import getResourceErrorPayload from 'lib/errors/getResourceErrorPayload';
import ErrorBoundary from 'ui/shared/ErrorBoundary';

import AppError from './AppError';
import AppErrorBlockConsensus from './AppErrorBlockConsensus';
import AppErrorInvalidTxHash from './AppErrorInvalidTxHash';

interface Props {
  children: React.ReactNode;
}

// TODO @tom2drum refactor AppError

const AppErrorScreen = ({ children }: Props) => {
  const renderErrorScreen = React.useCallback((error?: Error) => {
    const statusCode = getErrorCauseStatusCode(error) || 500;
    const resourceErrorPayload = getResourceErrorPayload(error);
    const messageInPayload =
          resourceErrorPayload &&
          typeof resourceErrorPayload === 'object' &&
          'message' in resourceErrorPayload &&
          typeof resourceErrorPayload.message === 'string' ?
            resourceErrorPayload.message :
            undefined;

    const isInvalidTxHash = error?.message?.includes('Invalid tx hash');
    const isBlockConsensus = messageInPayload?.includes('Block lost consensus');

    if (isInvalidTxHash) {
      return <AppErrorInvalidTxHash/>;
    }

    if (isBlockConsensus) {
      const hash =
            resourceErrorPayload &&
            typeof resourceErrorPayload === 'object' &&
            'hash' in resourceErrorPayload &&
            typeof resourceErrorPayload.hash === 'string' ?
              resourceErrorPayload.hash :
              undefined;
      return <AppErrorBlockConsensus hash={ hash } mt="50px"/>;
    }

    return <AppError statusCode={ statusCode } mt="50px"/>;
  }, []);

  return (
    <ErrorBoundary renderErrorScreen={ renderErrorScreen }>
      { children }
    </ErrorBoundary>
  );
};

export default AppErrorScreen;
