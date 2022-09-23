import type { Network } from 'types/networks';

import arbitrumIcon from 'icons/networks/icons/arbitrum.svg';
import artisIcon from 'icons/networks/icons/artis.svg';
import ethereumClassicIcon from 'icons/networks/icons/ethereum-classic.svg';
import ethereumIcon from 'icons/networks/icons/ethereum.svg';
import gnosisIcon from 'icons/networks/icons/gnosis.svg';
import optimismIcon from 'icons/networks/icons/optimism.svg';
import poaSokolIcon from 'icons/networks/icons/poa-sokol.svg';
import poaIcon from 'icons/networks/icons/poa.svg';
import rskIcon from 'icons/networks/icons/rsk.svg';

import parseNetworkConfig from './parseNetworkConfig';

// will change later when we agree how to host network icons
const ICONS: Record<string, React.FunctionComponent<React.SVGAttributes<SVGElement>>> = {
  'xdai/mainnet': gnosisIcon,
  'xdai/optimism': optimismIcon,
  'xdai/aox': arbitrumIcon,
  'eth/mainnet': ethereumIcon,
  'etc/mainnet': ethereumClassicIcon,
  'poa/core': poaIcon,
  'rsk/mainnet': rskIcon,
  'xdai/testnet': arbitrumIcon,
  'poa/sokol': poaSokolIcon,
  'artis/sigma1': artisIcon,
};

const LOGOS: Record<string, React.FunctionComponent<React.SVGAttributes<SVGElement>>> = {
  'xdai/mainnet': require('icons/networks/logos/gnosis.svg'),
  'eth/mainnet': require('icons/networks/logos/eth.svg'),
  'etc/mainnet': require('icons/networks/logos/etc.svg'),
  'poa/core': require('icons/networks/logos/poa.svg'),
  'rsk/mainnet': require('icons/networks/logos/rsk.svg'),
  'xdai/testnet': require('icons/networks/logos/gnosis.svg'),
  'poa/sokol': require('icons/networks/logos/sokol.svg'),
  'artis/sigma1': require('icons/networks/logos/artis.svg'),
  'lukso/l14': require('icons/networks/logos/lukso.svg'),
  astar: require('icons/networks/logos/astar.svg'),
  shiden: require('icons/networks/logos/shiden.svg'),
  shibuya: require('icons/networks/logos/shibuya.svg'),
};

const NETWORKS: Array<Network> = (() => {
  const networksFromConfig: Array<Network> = parseNetworkConfig();
  return networksFromConfig.map((network) => ({
    ...network,
    logo: network.logo || LOGOS[network.type + (network.subType ? `/${ network.subType }` : '')],
    icon: network.icon || ICONS[network.type + (network.subType ? `/${ network.subType }` : '')],
  }));
})();

export default NETWORKS;

// for easy env creation
// const FOR_CONFIG = [
//   {
//     name: 'Gnosis Chain',
//     type: 'xdai',
//     subType: 'mainnet',
//     group: 'mainnets',
//     isAccountSupported: true,
//     chainId: 100
//   },
//   {
//     name: 'Optimism on Gnosis Chain',
//     shortName: 'OoG',
//     type: 'xdai',
//     subType: 'optimism',
//     group: 'mainnets',
//     icon: 'https://www.fillmurray.com/60/60'
//     chainId: 300
//   },
//   {
//     name: 'Arbitrum on xDai',
//     type: 'xdai',
//     subType: 'aox',
//     group: 'mainnets',
//     chainId: 200
//   },
//   {
//     name: 'Ethereum',
//     shortName: 'ETH',
//     type: 'eth',
//     subType: 'mainnet',
//     group: 'mainnets',
//     chainId: 1
//   },
//   {
//     name: 'Ethereum Classic',
//     shortName: 'ETC',
//     type: 'etc',
//     subType: 'mainnet',
//     group: 'mainnets',
//     chainId: 61
//   },
//   {
//     name: 'POA',
//     shortName: 'POA',
//     type: 'poa',
//     subType: 'core',
//     group: 'mainnets',
//     chainId: 99
//   },
//   {
//     name: 'RSK',
//     shortName: 'RBTC',
//     type: 'rsk',
//     subType: 'mainnet',
//     group: 'mainnets',
//     chainId: 30
//   },
//   {
//     name: 'Gnosis Chain Testnet',
//     type: 'xdai',
//     subType: 'testnet',
//     group: 'testnets',
//     isAccountSupported: true,
//   },
//   {
//     name: 'POA Sokol',
//     shortName: 'POA',
//     type: 'poa',
//     subType: 'sokol',
//     group: 'testnets',
//     chainId: 77
//   },
//   {
//     name: 'ARTIS Σ1',
//     type: 'artis',
//     subType: 'sigma1',
//     group: 'other',
//     chainId: 246529
//   },
//   {
//     name: 'LUKSO L14',
//     shortName: 'POA',
//     type: 'lukso',
//     subType: 'l14',
//     group: 'other',
//     chainId: 22
//   },
// ];
