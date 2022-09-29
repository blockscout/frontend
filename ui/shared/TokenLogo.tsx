import { Image, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Network } from 'types/networks';

import useNetwork from 'lib/hooks/useNetwork';

const EmptyElement = () => null;

const ASSETS_PATH_MAP: Record<string, string> = {
  'xdai/mainnet': 'xdai',
  'xdai/testnet': 'xdai',
  'xdai/optimism': 'optimism',
  'xdai/aox': 'arbitrum',
  'eth/mainnet': 'ethereum',
  'etc/mainnet': 'classic',
  'poa/core': 'poa',
};

const getAssetsPath = (network: Network) => {
  if (network.assetsNamePath) {
    return network.assetsNamePath;
  }

  const key = [ network.type, network.subType ].filter(Boolean).join('/');
  const nameFromMap = ASSETS_PATH_MAP[key];

  return nameFromMap || network.type;
};

interface Props {
  hash: string;
  name: string;
  className?: string;
}

const TokenLogo = ({ hash, name, className }: Props) => {
  const network = useNetwork();

  if (!network) {
    return null;
  }

  const assetsPath = getAssetsPath(network);
  const logoSrc = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${ assetsPath }/assets/${ hash }/logo.png`;

  return <Image className={ className } src={ logoSrc } alt={ `${ name } logo` } fallback={ <EmptyElement/> }/>;
};

export default React.memo(chakra(TokenLogo));
