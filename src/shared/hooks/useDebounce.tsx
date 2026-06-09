// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

// REFACTOR: replace with useDebounce from es-toolkit
export default function useDebounce(value: string, delay: number) {
  const [ debouncedValue, setDebouncedValue ] = React.useState(value);
  React.useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [ value, delay ],
  );
  return debouncedValue;
}
