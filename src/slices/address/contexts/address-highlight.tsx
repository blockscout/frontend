// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

interface AddressHighlightProviderProps {
  children: React.ReactNode;
}

interface TAddressHighlightContext {
  onMouseEnter: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
}

const HIGHLIGHTED_CLASS = 'address-entity_highlighted';

export const AddressHighlightContext = React.createContext<TAddressHighlightContext | null>(null);

export function AddressHighlightProvider({ children }: AddressHighlightProviderProps) {
  const timeoutId = React.useRef<number | null>(null);

  const clearHighlightTimeout = React.useCallback(() => {
    typeof timeoutId.current === 'number' && window.clearTimeout(timeoutId.current);
  }, []);

  const onMouseEnter = React.useCallback((event: React.MouseEvent) => {
    const target = event.currentTarget;
    const hash = target.getAttribute('data-hash');
    if (hash) {
      clearHighlightTimeout();
      timeoutId.current = window.setTimeout(() => {
        // A lazily mounted tooltip swaps the DOM node under the cursor right after the first hover,
        // and the browser may never dispatch 'mouseleave' if the pointer exits before it re-targets.
        if (!target.matches(':hover')) {
          return;
        }
        // for better performance we update DOM-nodes directly bypassing React reconciliation
        const nodes = window.document.querySelectorAll(`[data-hash="${ hash }"]`);
        for (const node of nodes) {
          node.classList.add(HIGHLIGHTED_CLASS);
        }
      }, 100);
    }
  }, [ clearHighlightTimeout ]);

  const onMouseLeave = React.useCallback(() => {
    const nodes = window.document.querySelectorAll(`.${ HIGHLIGHTED_CLASS }`);
    for (const node of nodes) {
      node.classList.remove(HIGHLIGHTED_CLASS);
    }
    clearHighlightTimeout();
  }, [ clearHighlightTimeout ]);

  const value = React.useMemo(() => {
    return {
      onMouseEnter,
      onMouseLeave,
    };
  }, [ onMouseEnter, onMouseLeave ]);

  React.useEffect(() => {
    return clearHighlightTimeout;
  }, [ clearHighlightTimeout ]);

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
