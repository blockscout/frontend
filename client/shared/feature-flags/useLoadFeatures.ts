import React from 'react';

import { SECOND } from 'toolkit/utils/consts';

import useUsercentricsConsent from '../analytics/usercentrics/useUsercentricsConsent';
import { initGrowthBook } from './init';

export default function useLoadFeatures(uuid: string) {

  const [ growthBook ] = React.useState(initGrowthBook(uuid));

  const usercentricsConsent = useUsercentricsConsent();

  React.useEffect(() => {
    if (!growthBook || !usercentricsConsent?.growthBook) {
      return;
    }

    growthBook.setAttributes({
      ...growthBook.getAttributes(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: window.navigator.language,
    });

    growthBook.loadFeatures({ timeout: SECOND });
  }, [ usercentricsConsent?.growthBook, growthBook ]);

  return React.useMemo(() => {
    if (!growthBook || !usercentricsConsent?.growthBook) {
      return;
    }

    return growthBook;
  }, [ growthBook, usercentricsConsent?.growthBook ]);
}
