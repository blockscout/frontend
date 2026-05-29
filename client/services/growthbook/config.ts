// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'client/config/app';
import { getEnvValue } from 'client/config/utils/envs';

const clientKey = getEnvValue('NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY');

const config = Object.freeze({
  clientKey: !app.isPrivateMode ? clientKey : undefined,
});

export default config;
