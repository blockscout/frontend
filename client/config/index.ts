// SPDX-License-Identifier: LicenseRef-Blockscout

import meta from '../shared/metadata/config';
import chain from '../slices/chain/config';
import apis from './apis';
import app from './app';
import * as features from './features';
import misc from './misc';
import services from './services';
import * as shell from './shell';
import * as slices from './slices';

const config = Object.freeze({
  app,
  chain,
  apis,
  shell,
  slices,
  features,
  services,
  meta,
  misc,
});

export default config;
