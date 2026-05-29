// SPDX-License-Identifier: LicenseRef-Blockscout

import appConfig from 'src/config';

export default function getSocketUrl(config: typeof appConfig = appConfig) {
  return config.apis.core ? `${ config.apis.core.socketEndpoint }${ config.apis.core.basePath ?? '' }/socket/v2` : undefined;
}
