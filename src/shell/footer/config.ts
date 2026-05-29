// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue, getExternalAssetFilePath } from 'src/config/utils/envs';

const config = Object.freeze({
  links: getExternalAssetFilePath('NEXT_PUBLIC_FOOTER_LINKS'),
  frontendVersion: getEnvValue('NEXT_PUBLIC_GIT_TAG'),
  frontendCommit: getEnvValue('NEXT_PUBLIC_GIT_COMMIT_SHA'),
});

export default config;
