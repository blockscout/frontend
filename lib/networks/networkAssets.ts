import type React from 'react';

import type { PreDefinedNetwork } from 'types/networks';

import arbitrumIcon from 'icons/networks/icons/arbitrum.svg';
import artisIcon from 'icons/networks/icons/artis.svg';
import ethereumClassicIcon from 'icons/networks/icons/ethereum-classic.svg';
import ethereumIcon from 'icons/networks/icons/ethereum.svg';
import gnosisIcon from 'icons/networks/icons/gnosis.svg';
import goerliIcon from 'icons/networks/icons/goerli.svg';
import optimismIcon from 'icons/networks/icons/optimism.svg';
import poaSokolIcon from 'icons/networks/icons/poa-sokol.svg';
import poaIcon from 'icons/networks/icons/poa.svg';
import rskIcon from 'icons/networks/icons/rsk.svg';
import artisLogo from 'icons/networks/logos/artis.svg';
import astarLogo from 'icons/networks/logos/astar.svg';
import etcLogo from 'icons/networks/logos/etc.svg';
import ethLogo from 'icons/networks/logos/eth.svg';
import gnosisLogo from 'icons/networks/logos/gnosis.svg';
import goerliLogo from 'icons/networks/logos/goerli.svg';
import luksoLogo from 'icons/networks/logos/lukso.svg';
import poaLogo from 'icons/networks/logos/poa.svg';
import rskLogo from 'icons/networks/logos/rsk.svg';
import shibuyaLogo from 'icons/networks/logos/shibuya.svg';
import shidenLogo from 'icons/networks/logos/shiden.svg';
import sokolLogo from 'icons/networks/logos/sokol.svg';

interface NetworkAssets {
  icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  logo?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  smallLogo?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const networkAssets: Partial<Record<PreDefinedNetwork, NetworkAssets>> = {
  xdai_mainnet: {
    icon: gnosisIcon,
    logo: gnosisLogo,
  },
  xdai_optimism: {
    icon: optimismIcon,
  },
  xdai_aox: {
    icon: arbitrumIcon,
  },
  eth_mainnet: {
    icon: ethereumIcon,
    logo: ethLogo,
  },
  etc_mainnet: {
    icon: ethereumClassicIcon,
    logo: etcLogo,
  },
  poa_core: {
    icon: poaIcon,
    logo: poaLogo,
  },
  rsk_mainnet: {
    icon: rskIcon,
    logo: rskLogo,
  },
  xdai_testnet: {
    icon: arbitrumIcon,
    logo: gnosisLogo,
  },
  poa_sokol: {
    icon: poaSokolIcon,
    logo: sokolLogo,
  },
  artis_sigma1: {
    icon: artisIcon,
    logo: artisLogo,
  },
  lukso_l14: {
    logo: luksoLogo,
  },
  astar: {
    logo: astarLogo,
  },
  shiden: {
    logo: shidenLogo,
  },
  shibuya: {
    logo: shibuyaLogo,
  },
  goerli: {
    logo: goerliLogo,
    icon: goerliIcon,
  },
};

export default networkAssets;
