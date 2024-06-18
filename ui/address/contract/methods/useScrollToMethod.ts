import React from 'react';
import { scroller } from 'react-scroll';

import type { SmartContractMethod } from './types';

export const getElementName = (id: string) => `method_${ id }`;

export default function useScrollToMethod(data: Array<SmartContractMethod>, onScroll: (indices: Array<number>) => void) {
  React.useEffect(() => {
    const id = window.location.hash.replace('#', '');

    if (!id) {
      return;
    }

    const index = data.findIndex((item) => 'method_id' in item && item.method_id === id);
    if (index > -1) {
      scroller.scrollTo(getElementName(id), {
        duration: 500,
        smooth: true,
        offset: -100,
      });
      onScroll([ index ]);
    }
  }, [ data, onScroll ]);
}
