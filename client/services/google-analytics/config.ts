// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'client/config/app';
import { getEnvValue } from 'client/config/utils/envs';

const propertyId = getEnvValue('NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID');

const config = Object.freeze({
  propertyId: !app.isPrivateMode ? propertyId : undefined,
});

export default config;
