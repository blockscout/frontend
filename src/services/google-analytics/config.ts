// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'src/config/app';
import { getEnvValue } from 'src/config/utils/envs';

const propertyId = getEnvValue('NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID');

const config = Object.freeze({
  propertyId: !app.isPrivateMode ? propertyId : undefined,
});

export default config;
