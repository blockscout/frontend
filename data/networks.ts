import type { Network } from 'types/networks';

import arbitrumIcon from 'icons/networks/arbitrum.svg';
import artisIcon from 'icons/networks/artis.svg';
import ethereumClassicIcon from 'icons/networks/ethereum-classic.svg';
import ethereumIcon from 'icons/networks/ethereum.svg';
import gnosisIcon from 'icons/networks/gnosis.svg';
import optimismIcon from 'icons/networks/optimism.svg';
import poaSokolIcon from 'icons/networks/poa-sokol.svg';
import poaIcon from 'icons/networks/poa.svg';
import rskIcon from 'icons/networks/rsk.svg';

export const NETWORKS: Array<Network> = [
  {
    name: 'Gnosis Chain',
    type: 'xdai',
    subType: 'mainnet',
    icon: gnosisIcon,
    group: 'mainnets',
    isAccountSupported: true,
    isNewUiSupported: true,
  },
  {
    name: 'Optimism on Gnosis Chain',
    type: 'xdai',
    subType: 'optimism',
    icon: optimismIcon,
    group: 'mainnets',
  },
  {
    name: 'Arbitrum on xDai',
    type: 'xdai',
    subType: 'aox',
    icon: arbitrumIcon,
    group: 'mainnets',
  },
  {
    name: 'Ethereum',
    type: 'eth',
    subType: 'mainnet',
    icon: ethereumIcon,
    group: 'mainnets',
  },
  {
    name: 'Ethereum Classic',
    type: 'etc',
    subType: 'mainnet',
    icon: ethereumClassicIcon,
    group: 'mainnets',
  },
  {
    name: 'POA',
    type: 'poa',
    subType: 'core',
    icon: poaIcon,
    group: 'mainnets',
  },
  {
    name: 'RSK',
    type: 'rsk',
    subType: 'mainnet',
    icon: rskIcon,
    group: 'mainnets',
  },
  {
    name: 'Gnosis Chain Testnet',
    type: 'xdai',
    subType: 'testnet',
    icon: arbitrumIcon,
    group: 'testnets',
    isAccountSupported: true,
    isNewUiSupported: true,
  },
  {
    name: 'POA Sokol',
    type: 'poa',
    subType: 'sokol',
    icon: poaSokolIcon,
    group: 'testnets',
  },
  {
    name: 'ARTIS Σ1',
    type: 'artis',
    subType: 'sigma1',
    icon: artisIcon,
    group: 'other',
  },
  {
    name: 'LUKSO L14',
    type: 'lukso',
    subType: 'l14',
    group: 'other',
  },
];
