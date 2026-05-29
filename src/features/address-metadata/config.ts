// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'src/config/apis';
import app from 'src/config/app';
import * as services from 'src/config/services';
import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Address metadata';

const config: Feature<{ isTagsUpdateEnabled: boolean; isTagSubmitionEnabled: boolean }> = (() => {
  if (apis.metadata) {
    const isTagSubmitionEnabled = !app.isPrivateMode && Boolean(services.reCaptcha.siteKey) && Boolean(apis.admin);
    return Object.freeze({
      title,
      isEnabled: true,
      isTagsUpdateEnabled: getEnvValue('NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED') !== 'false',
      isTagSubmitionEnabled,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
