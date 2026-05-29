// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from '../api/config';
import metadata from '../shell/metadata/config';
import chain from '../slices/chain/config';
import app from './app';
import * as features from './features';
import misc from './misc';
import * as services from './services';
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
  metadata,
  misc,
});

export default config;
