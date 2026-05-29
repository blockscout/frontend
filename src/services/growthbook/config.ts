// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'src/config/app';
import { getEnvValue } from 'src/config/utils/envs';

const clientKey = getEnvValue('NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY');

const config = Object.freeze({
  clientKey: !app.isPrivateMode ? clientKey : undefined,
});

export default config;
