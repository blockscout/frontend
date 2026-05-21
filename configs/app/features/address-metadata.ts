// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Feature } from './types';

import apis from '../apis';
import app from '../app';
import services from '../services';
import { getEnvValue } from '../utils';

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
