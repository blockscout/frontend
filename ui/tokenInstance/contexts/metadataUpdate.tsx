import React from 'react';

interface MetadataUpdateProviderProps {
  children: React.ReactNode;
}

interface TMetadataUpdateContext {
  status: Status;
  setStatus: (status: Status) => void;
}

export const MetadataUpdateContext = React.createContext<TMetadataUpdateContext | null>(null);

type Status = 'INITIAL' | 'MODAL_OPENED' | 'UPDATING' | 'SUCCESS' | 'ERROR';

export function MetadataUpdateProvider({ children }: MetadataUpdateProviderProps) {

  const [ status, setStatus ] = React.useState<Status>('INITIAL');

  // eslint-disable-next-line no-console
  console.log('__>__ status:', status);

  const value = React.useMemo(() => {
    return {
      status,
      setStatus,
    };
  }, [ status ]);

  return (
    <MetadataUpdateContext.Provider value={ value }>
      { children }
    </MetadataUpdateContext.Provider>
  );
}

export function useMetadataUpdateContext() {
  const context = React.useContext(MetadataUpdateContext);
  if (context === undefined) {
    return null;
  }
  return context;
}
