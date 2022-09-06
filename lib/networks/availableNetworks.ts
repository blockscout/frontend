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
  'xdai/mainnet': require('icons/networkLogos/gnosis.svg'),
  'eth/mainnet': require('icons/networkLogos/eth.svg'),
  'etc/mainnet': require('icons/networkLogos/etc.svg'),
  'poa/core': require('icons/networkLogos/poa.svg'),
  'rsk/mainnet': require('icons/networkLogos/rsk.svg'),
  'xdai/testnet': require('icons/networkLogos/gnosis.svg'),
  'poa/sokol': require('icons/networkLogos/sokol.svg'),
  'artis/sigma1': require('icons/networkLogos/artis.svg'),
  'lukso/l14': require('icons/networkLogos/lukso.svg'),
  astar: require('icons/networkLogos/astar.svg'),
  shiden: require('icons/networkLogos/shiden.svg'),
  shibuya: require('icons/networkLogos/shibuya.svg'),
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
//   },
//   {
//     name: 'Optimism on Gnosis Chain',
//     shortName: 'OoG',
//     type: 'xdai',
//     subType: 'optimism',
//     group: 'mainnets',
//     icon: 'https://www.fillmurray.com/60/60'
//   },
//   {
//     name: 'Arbitrum on xDai',
//     type: 'xdai',
//     subType: 'aox',
//     group: 'mainnets',
//   },
//   {
//     name: 'Ethereum',
//     shortName: 'ETH',
//     type: 'eth',
//     subType: 'mainnet',
//     group: 'mainnets',
//   },
//   {
//     name: 'Ethereum Classic',
//     shortName: 'ETC',
//     type: 'etc',
//     subType: 'mainnet',
//     group: 'mainnets',
//   },
//   {
//     name: 'POA',
//     shortName: 'POA',
//     type: 'poa',
//     subType: 'core',
//     group: 'mainnets',
//   },
//   {
//     name: 'RSK',
//     shortName: 'RBTC',
//     type: 'rsk',
//     subType: 'mainnet',
//     group: 'mainnets',
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
//   },
//   {
//     name: 'ARTIS Σ1',
//     type: 'artis',
//     subType: 'sigma1',
//     group: 'other',
//   },
//   {
//     name: 'LUKSO L14',
//     shortName: 'POA',
//     type: 'lukso',
//     subType: 'l14',
//     group: 'other',
//   },
// ];
