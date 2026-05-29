// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'client/config/app';
import { getEnvValue } from 'client/config/utils/envs';

const clientToken = getEnvValue('NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN');
const instance = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_APP_INSTANCE');
  if (envValue) {
    return envValue;
  }

  return app.host?.replace('.blockscout.com', '').replace('.k8s-dev', '').replaceAll('-', '_');
})();
const environment = getEnvValue('NEXT_PUBLIC_APP_ENV') || 'production';
const codeVersion = getEnvValue('NEXT_PUBLIC_GIT_TAG') || getEnvValue('NEXT_PUBLIC_GIT_COMMIT_SHA');

const config = Object.freeze({
  clientToken: !app.isPrivateMode ? clientToken : undefined,
  environment,
  instance,
  codeVersion,
});

export default config;
