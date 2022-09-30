// todo_tom delete this
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

// for easy .env.example update
// const FEATURED_CHAINS = JSON.stringify([
//   {
//     title: 'Gnosis Chain',
//     basePath: '/xdai/mainnet',
//     group: 'mainnets',
//   },
//   {
//     name: 'Optimism on Gnosis Chain',
//     basePath: '/xdai/optimism',
//     group: 'mainnets',
//     icon: 'https://www.fillmurray.com/60/60',
//   },
//   {
//     name: 'Arbitrum on xDai',
//     basePath: '/xdai/aox',
//     group: 'mainnets',
//   },
//   {
//     name: 'Ethereum',
//     basePath: '/eth/mainnet',
//     group: 'mainnets',
//   },
//   {
//     name: 'Ethereum Classic',
//     basePath: '/etx/mainnet',
//     group: 'mainnets',
//   },
//   {
//     name: 'POA',
//     basePath: '/poa/core',
//     group: 'mainnets',
//   },
//   {
//     name: 'RSK',
//     basePath: '/rsk/mainnet',
//     group: 'mainnets',
//   },
//   {
//     name: 'Gnosis Chain Testnet',
//     basePath: '/xdai/testnet',
//     group: 'testnets',
//   },
//   {
//     name: 'POA Sokol',
//     basePath: '/poa/sokol',
//     group: 'testnets',
//   },
//   {
//     name: 'ARTIS Σ1',
//     basePath: '/artis/sigma1',
//     group: 'other',
//   },
//   {
//     name: 'LUKSO L14',
//     basePath: '/lukso/l14',
//     group: 'other',
//   },
//   {
//     name: 'Astar',
//     basePath: '/astar',
//     group: 'other',
//   },
// ]);
