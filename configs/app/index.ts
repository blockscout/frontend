import * as allChains from 'viem/chains';

import api from './api';
import app from './app';
import chain from './chain';
import * as features from './features';
import meta from './meta';
import services from './services';
import UI from './ui';
import { getEnvValue } from './utils';

const l1Network = getEnvValue('NEXT_PUBLIC_L1_NETWORK') as undefined | 'sepolia' | 'mainnet';
const l1Chain = l1Network ? allChains[ l1Network ] : null;

const config = Object.freeze({
  app,
  chain,
  l1Chain,
  api,
  UI,
  features,
  services,
  meta,
});

export default config;
