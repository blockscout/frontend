// SPDX-License-Identifier: LicenseRef-Blockscout

import Specify from '@specify-sh/publisher-sdk';

import config from 'src/config';

const PUBLISHER_KEY = 'spk_uq51124ciii28vt00f8za4m5hibpuh';

let client: Specify | undefined;

export function getSpecifyClient(): Specify {
  if (!client) {
    client = new Specify({ publisherKey: PUBLISHER_KEY });
    client.setCookieConsent(config.services.usercentrics?.consent.specify ?? true);
  }

  return client;
}
