// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue, parseEnvJson } from 'client/config/utils/envs';

const maintenanceAlertMessage = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE');
  const parsedValue = envValue ? parseEnvJson<Array<string>>(envValue) : undefined;

  if (!parsedValue || !Array.isArray(parsedValue)) {
    return envValue;
  }

  if (parsedValue.length < 2) {
    return parsedValue[0];
  }

  const index = Math.floor(Math.random() * parsedValue.length);

  return parsedValue[index];
})();

const config = Object.freeze({
  maintenanceAlert: {
    message: maintenanceAlertMessage || '',
  },
});

export default config;
