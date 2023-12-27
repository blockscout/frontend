import React from 'react';

interface AddressHighlightProviderProps {
  children: React.ReactNode;
}

interface TAddressHighlightContext {
  highlightedAddress: string | null;
  onMouseEnter: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
}

export const AddressHighlightContext = React.createContext<TAddressHighlightContext | null>(null);

export function AddressHighlightProvider({ children }: AddressHighlightProviderProps) {
  const [ highlightedAddress, setHighlightedAddress ] = React.useState<string | null>(null);
  const timeoutId = React.useRef<number | null>(null);

  const onMouseEnter = React.useCallback((event: React.MouseEvent) => {
    const hash = event.currentTarget.getAttribute('data-hash');
    if (hash) {
      timeoutId.current = window.setTimeout(() => {
        setHighlightedAddress(hash);
      }, 100);
    }
  }, []);

  const onMouseLeave = React.useCallback(() => {
    setHighlightedAddress(null);
    typeof timeoutId.current === 'number' && window.clearTimeout(timeoutId.current);
  }, []);

  const value = React.useMemo(() => {
    return {
      highlightedAddress,
      onMouseEnter,
      onMouseLeave,
    };
  }, [ highlightedAddress, onMouseEnter, onMouseLeave ]);

  React.useEffect(() => {
    return () => {
      typeof timeoutId.current === 'number' && window.clearTimeout(timeoutId.current);
    };
  }, []);

  return (
    <AddressHighlightContext.Provider value={ value }>
      { children }
    </AddressHighlightContext.Provider>
  );
}

export function useAddressHighlightContext() {
  const context = React.useContext(AddressHighlightContext);
  if (context === undefined) {
    return null;
  }
  return context;
}
