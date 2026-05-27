// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'client/config/apis';
import app from 'client/config/app';
import services from 'client/config/services';
import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const title = 'Address metadata';

const config: Feature<{ isTagsUpdateEnabled: boolean; isTagSubmitionEnabled: boolean }> = (() => {
  if (apis.metadata) {
    const isTagSubmitionEnabled = !app.isPrivateMode && Boolean(services.reCaptchaV2.siteKey) && Boolean(apis.admin);
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
