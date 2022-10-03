import appConfig from 'configs/app/config';

import type { FeaturedNetwork } from 'types/networks';

import arbitrumIcon from 'icons/networks/icons/arbitrum.svg';
import artisIcon from 'icons/networks/icons/artis.svg';
import ethereumClassicIcon from 'icons/networks/icons/ethereum-classic.svg';
import ethereumIcon from 'icons/networks/icons/ethereum.svg';
import gnosisIcon from 'icons/networks/icons/gnosis.svg';
import optimismIcon from 'icons/networks/icons/optimism.svg';
import poaSokolIcon from 'icons/networks/icons/poa-sokol.svg';
import poaIcon from 'icons/networks/icons/poa.svg';
import rskIcon from 'icons/networks/icons/rsk.svg';

// predefined network icons
const ICONS: Record<string, React.FunctionComponent<React.SVGAttributes<SVGElement>>> = {
  '/xdai/mainnet': gnosisIcon,
  '/xdai/optimism': optimismIcon,
  '/xdai/aox': arbitrumIcon,
  '/eth/mainnet': ethereumIcon,
  '/etc/mainnet': ethereumClassicIcon,
  '/poa/core': poaIcon,
  '/rsk/mainnet': rskIcon,
  '/xdai/testnet': arbitrumIcon,
  '/poa/sokol': poaSokolIcon,
  '/artis/sigma1': artisIcon,
};

// for easy .env.example update
// const FEATURED_NETWORKS = JSON.stringify([
//   {
//     title: 'Gnosis Chain',
//     basePath: '/xdai/mainnet',
//     group: 'mainnets',
//   },
//   {
//     title: 'Optimism on Gnosis Chain',
//     basePath: '/xdai/optimism',
//     group: 'mainnets',
//     icon: 'https://www.fillmurray.com/60/60',
//   },
//   {
//     title: 'Arbitrum on xDai',
//     basePath: '/xdai/aox',
//     group: 'mainnets',
//   },
//   {
//     title: 'Ethereum',
//     basePath: '/eth/mainnet',
//     group: 'mainnets',
//   },
//   {
//     title: 'Ethereum Classic',
//     basePath: '/etx/mainnet',
//     group: 'mainnets',
//   },
//   {
//     title: 'POA',
//     basePath: '/poa/core',
//     group: 'mainnets',
//   },
//   {
//     title: 'RSK',
//     basePath: '/rsk/mainnet',
//     group: 'mainnets',
//   },
//   {
//     title: 'Gnosis Chain Testnet',
//     basePath: '/xdai/testnet',
//     group: 'testnets',
//   },
//   {
//     title: 'POA Sokol',
//     basePath: '/poa/sokol',
//     group: 'testnets',
//   },
//   {
//     title: 'ARTIS Σ1',
//     basePath: '/artis/sigma1',
//     group: 'other',
//   },
//   {
//     title: 'LUKSO L14',
//     basePath: '/lukso/l14',
//     group: 'other',
//   },
//   {
//     title: 'Astar',
//     basePath: '/astar',
//     group: 'other',
//   },
// ]);

function parseNetworkConfig() {
  try {
    return JSON.parse(appConfig.featuredNetworks || '[]');
  } catch (error) {
    return [];
  }
}

const featuredNetworks: Array<FeaturedNetwork> = (() => {
  const networksFromConfig: Array<FeaturedNetwork> = parseNetworkConfig();
  return networksFromConfig.map((network) => ({
    ...network,
    icon: network.icon || ICONS[network.basePath],
  }));
})();

export default featuredNetworks;
