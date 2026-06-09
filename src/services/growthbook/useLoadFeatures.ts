// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { SECOND } from 'src/toolkit/utils/consts';

import { initGrowthBook } from './init';

export default function useLoadFeatures(uuid: string) {

  const [ growthBook ] = React.useState(initGrowthBook(uuid));

  React.useEffect(() => {
    if (!growthBook) {
      return;
    }

    growthBook.setAttributes({
      ...growthBook.getAttributes(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: window.navigator.language,
    });

    growthBook.loadFeatures({ timeout: SECOND });
  }, [ growthBook ]);

  return growthBook;
}
