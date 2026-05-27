// SPDX-License-Identifier: LicenseRef-Blockscout

import meta from '../shared/metadata/config';
import chain from '../slices/chain/config';
import apis from './apis';
import app from './app';
import * as features from './features';
import services from './services';
import UI from './ui';

const config = Object.freeze({
  app,
  chain,
  apis,
  UI,
  features,
  services,
  meta,
});

export default config;
