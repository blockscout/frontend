// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'src/config/app';
import { getEnvValue } from 'src/config/utils/envs';
import usercentrics from 'src/services/usercentrics/config';

const clientKey = getEnvValue('NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY');

const config = Object.freeze({
  clientKey: !app.isPrivateMode && !(usercentrics && !usercentrics.consent?.growthBook) ? clientKey : undefined,
});

export default config;
