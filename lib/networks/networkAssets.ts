import type React from 'react';

import type { PreDefinedNetwork } from 'types/networks';

import arbitrumIcon from 'icons/networks/icons/arbitrum.svg';
import artisIcon from 'icons/networks/icons/artis.svg';
import astarIcon from 'icons/networks/icons/astar.svg';
import baseIcon from 'icons/networks/icons/base.svg';
import ethereumClassicIcon from 'icons/networks/icons/ethereum-classic.svg';
import ethereumIcon from 'icons/networks/icons/ethereum.svg';
import gnosisIcon from 'icons/networks/icons/gnosis.svg';
import goerliIcon from 'icons/networks/icons/goerli.svg';
import liFiIcon from 'icons/networks/icons/li-fi.svg';
import luksoIcon from 'icons/networks/icons/lukso.svg';
import optimismIcon from 'icons/networks/icons/optimism.svg';
import smallLogoPlaceholder from 'icons/networks/icons/placeholder.svg';
import poaSokolIcon from 'icons/networks/icons/poa-sokol.svg';
import poaIcon from 'icons/networks/icons/poa.svg';
import rootstockIcon from 'icons/networks/icons/rootstock.svg';
import rskIcon from 'icons/networks/icons/rsk.svg';
import shibuyaIcon from 'icons/networks/icons/shibuya.svg';
import shidenIcon from 'icons/networks/icons/shiden.svg';
import tombscoutIconDark from 'icons/networks/icons/tombscout-dark.svg';
import tombscoutIcon from 'icons/networks/icons/tombscout.svg';
import zetachainIcon from 'icons/networks/icons/zetachain.svg';
import artisLogo from 'icons/networks/logos/artis.svg';
import astarLogoDark from 'icons/networks/logos/astar-dark.svg';
import astarLogo from 'icons/networks/logos/astar.svg';
import baseLogo from 'icons/networks/logos/base.svg';
import logoPlaceholder from 'icons/networks/logos/blockscout.svg';
import etcLogo from 'icons/networks/logos/etc.svg';
import ethLogo from 'icons/networks/logos/eth.svg';
import gnosisLogo from 'icons/networks/logos/gnosis.svg';
import goerliLogo from 'icons/networks/logos/goerli.svg';
import liFiLogo from 'icons/networks/logos/li-fi.svg';
import luksoLogo from 'icons/networks/logos/lukso.svg';
import optimismLogo from 'icons/networks/logos/optimism.svg';
import poaLogo from 'icons/networks/logos/poa.svg';
import rootstockLogo from 'icons/networks/logos/rootstock.svg';
import rskLogo from 'icons/networks/logos/rsk.svg';
import shibuyaLogo from 'icons/networks/logos/shibuya.svg';
import shidenLogoDark from 'icons/networks/logos/shiden-dark.svg';
import shidenLogo from 'icons/networks/logos/shiden.svg';
import sokolLogo from 'icons/networks/logos/sokol.svg';
import tombscoutLogoDark from 'icons/networks/logos/tombscout-dark.svg';
import tombscoutLogo from 'icons/networks/logos/tombscout.svg';
import zetachainLogo from 'icons/networks/logos/zetachain.svg';

interface NetworkAssets {
  logo: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  logoDark?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  smallLogo: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  smallLogoDark?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const networkAssets: Record<PreDefinedNetwork | 'fallback', NetworkAssets> = {
  fallback: {
    smallLogo: smallLogoPlaceholder,
    logo: logoPlaceholder,
  },
  gnosis: {
    smallLogo: gnosisIcon,
    logo: gnosisLogo,
  },
  xdai_mainnet: {
    smallLogo: gnosisIcon,
    logo: gnosisLogo,
  },
  eth_mainnet: {
    smallLogo: ethereumIcon,
    logo: ethLogo,
  },
  etc_mainnet: {
    smallLogo: ethereumClassicIcon,
    logo: etcLogo,
  },
  poa_core: {
    smallLogo: poaIcon,
    logo: poaLogo,
  },
  rsk_mainnet: {
    smallLogo: rskIcon,
    logo: rskLogo,
  },
  xdai_testnet: {
    smallLogo: arbitrumIcon,
    logo: gnosisLogo,
  },
  poa_sokol: {
    smallLogo: poaSokolIcon,
    logo: sokolLogo,
  },
  artis_sigma1: {
    smallLogo: artisIcon,
    logo: artisLogo,
  },
  lukso_l14: {
    smallLogo: luksoIcon,
    smallLogoDark: luksoIcon,
    logo: luksoLogo,
  },
  astar: {
    logo: astarLogo,
    logoDark: astarLogoDark,
    smallLogo: astarIcon,
    smallLogoDark: astarIcon,
  },
  shiden: {
    logo: shidenLogo,
    logoDark: shidenLogoDark,
    smallLogo: shidenIcon,
    smallLogoDark: shidenIcon,
  },
  shibuya: {
    logo: shibuyaLogo,
    smallLogo: shibuyaIcon,
  },
  goerli: {
    logo: goerliLogo,
    smallLogo: goerliIcon,
  },
  base_goerli: {
    logo: baseLogo,
    smallLogo: baseIcon,
  },
  zetachain: {
    logo: zetachainLogo,
    smallLogo: zetachainIcon,
  },
  rootstock: {
    logo: rootstockLogo,
    smallLogo: rootstockIcon,
  },
  'li-fi': {
    logo: liFiLogo,
    smallLogo: liFiIcon,
  },
  tombscout: {
    logo: tombscoutLogo,
    logoDark: tombscoutLogoDark,
    smallLogo: tombscoutIcon,
    smallLogoDark: tombscoutIconDark,
  },
  optimism: {
    logo: optimismLogo,
    logoDark: optimismLogo,
    smallLogo: optimismIcon,
    smallLogoDark: optimismIcon,
  },
};

export default networkAssets;
