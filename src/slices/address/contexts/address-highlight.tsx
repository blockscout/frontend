// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

interface AddressHighlightProviderProps {
  children: React.ReactNode;
}

interface TAddressHighlightContext {
  onMouseEnter: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
}

export const AddressHighlightContext = React.createContext<TAddressHighlightContext | null>(null);

export function AddressHighlightProvider({ children }: AddressHighlightProviderProps) {
  const timeoutId = React.useRef<number | null>(null);
  const hashRef = React.useRef<string | null>(null);

  const onMouseEnter = React.useCallback((event: React.MouseEvent) => {
    const target = event.currentTarget;
    const hash = target.getAttribute('data-hash');
    if (hash) {
      hashRef.current = hash;
      typeof timeoutId.current === 'number' && window.clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        // A lazily mounted tooltip swaps the DOM node under the cursor right after the first hover,
        // and the browser may never dispatch 'mouseleave' if the pointer exits before it re-targets.
        if (!target.matches(':hover')) {
          hashRef.current = null;
          return;
        }
        // for better performance we update DOM-nodes directly bypassing React reconciliation
        const nodes = window.document.querySelectorAll(`[data-hash="${ hashRef.current }"]`);
        for (const node of nodes) {
          node.classList.add('address-entity_highlighted');
        }
      }, 100);
    }
  }, []);

  const onMouseLeave = React.useCallback(() => {
    const nodes = window.document.querySelectorAll('.address-entity_highlighted');
    for (const node of nodes) {
      node.classList.remove('address-entity_highlighted');
    }
    hashRef.current = null;
    typeof timeoutId.current === 'number' && window.clearTimeout(timeoutId.current);
  }, []);

  const value = React.useMemo(() => {
    return {
      onMouseEnter,
      onMouseLeave,
    };
  }, [ onMouseEnter, onMouseLeave ]);

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

export function useAddressHighlightContext(disabled?: boolean) {
  const context = React.useContext(AddressHighlightContext);
  if (context === undefined || disabled) {
    return null;
  }
  return context;
}
