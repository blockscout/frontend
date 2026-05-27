// SPDX-License-Identifier: LicenseRef-Blockscout

import appConfig from 'client/config';

export default function getSocketUrl(config: typeof appConfig = appConfig) {
  return config.apis.general ? `${ config.apis.general.socketEndpoint }${ config.apis.general.basePath ?? '' }/socket/v2` : undefined;
}
