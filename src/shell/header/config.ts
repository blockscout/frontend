// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue, getRawEnvValue, parseEnvJson } from 'src/config/utils/envs';

const NAME = 'NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE';

const parseMessages = (value: string | undefined): Array<string> | undefined => {
  const parsedValue = value ? parseEnvJson<Array<string>>(value) : undefined;
  return Array.isArray(parsedValue) ? parsedValue : undefined;
};

const maintenanceAlertMessage = (() => {
  const envValue = getEnvValue(NAME);
  // getEnvValue turns every ' into ", which breaks a JSON item whose HTML has quoted attributes or an
  // apostrophe; the value as set is parsed first, the rewritten one keeps the `['a','b']` syntax working.
  const messages = parseMessages(getRawEnvValue(NAME)) ?? parseMessages(envValue);

  if (!messages) {
    return envValue;
  }

  const index = Math.floor(Math.random() * messages.length);

  return messages[index];
})();

const config = Object.freeze({
  maintenanceAlert: {
    message: maintenanceAlertMessage || '',
  },
});

export default config;
