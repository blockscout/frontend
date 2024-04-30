import React from 'react';

import { SECOND } from 'lib/consts';

import { growthBook } from './init';

export default function useLoadFeatures() {
  React.useEffect(() => {
    growthBook?.setAttributes({
      ...growthBook.getAttributes(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: window.navigator.language,
    });

    growthBook?.loadFeatures({ timeout: SECOND });
  }, []);
}
