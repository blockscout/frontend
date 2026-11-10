// SPDX-License-Identifier: LicenseRef-Blockscout

import { getRawEnvValue, parseEnvHtmlList } from 'src/config/utils/envs';

const messages = parseEnvHtmlList(getRawEnvValue('NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE'));

const config = Object.freeze({
  maintenanceAlert: {
    message: messages.length > 0 ? messages[Math.floor(Math.random() * messages.length)] : '',
  },
});

export default config;
