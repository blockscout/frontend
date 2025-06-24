import apis from './apis';
import app from './app';
import chain from './chain';
import * as features from './features';
import meta from './meta';
import network from './network';
import services from './services';
import UI from './ui';

const config = Object.freeze({
  app,
  network,
  chain,
  apis,
  UI,
  features,
  services,
  meta,
});

export default config;
