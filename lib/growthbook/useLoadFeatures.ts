import React from 'react';

import { SECOND } from 'lib/consts';

import { initGrowthBook } from './init';

export default function useLoadFeatures(uuid: string) {
  const growthBook = initGrowthBook(uuid);
  React.useEffect(() => {
    growthBook?.setAttributes({
      ...growthBook.getAttributes(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: window.navigator.language,
    });

    growthBook?.loadFeatures({ timeout: SECOND });
  }, [ growthBook ]);
}
