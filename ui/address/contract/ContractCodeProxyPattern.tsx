import { Alert } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractProxyType } from 'types/api/contract';

import LinkExternal from 'ui/shared/links/LinkExternal';

interface Props {
  type: NonNullable<SmartContractProxyType>;
}

const PROXY_TYPES: Record<NonNullable<SmartContractProxyType>, {
  name: string;
  link?: string;
  description?: string;
}> = {
  eip1167: {
    name: 'EIP-1167',
    link: 'https://eips.ethereum.org/EIPS/eip-1167',
    description: 'Minimal proxy',
  },
  eip1967: {
    name: 'EIP-1967',
    link: 'https://eips.ethereum.org/EIPS/eip-1967',
    description: 'Proxy storage slots',
  },
  eip1822: {
    name: 'EIP-1822',
    link: 'https://eips.ethereum.org/EIPS/eip-1822',
    description: 'Universal upgradeable proxy standard (UUPS)',
  },
  eip2535: {
    name: 'EIP-2535',
    link: 'https://eips.ethereum.org/EIPS/eip-2535',
    description: 'Diamond proxy',
  },
  eip930: {
    name: 'ERC-930',
    link: 'https://github.com/ethereum/EIPs/issues/930',
    description: 'Eternal storage',
  },
  clone_with_immutable_arguments: {
    name: 'Clones with immutable arguments',
    link: 'https://github.com/wighawag/clones-with-immutable-args',
  },
  master_copy: {
    name: 'GnosisSafe',
    link: 'https://github.com/safe-global/safe-smart-account',
  },
  comptroller: {
    name: 'Compound protocol',
    link: 'https://github.com/compound-finance/compound-protocol',
  },
  basic_implementation: {
    name: 'public implementation getter in proxy smart-contract',
  },
  basic_get_implementation: {
    name: 'public getImplementation getter in proxy smart-contract',
  },
  unknown: {
    name: 'Unknown proxy pattern',
  },
};

const ContractCodeProxyPattern = ({ type }: Props) => {
  const proxyInfo = PROXY_TYPES[type];

  if (!proxyInfo || type === 'unknown') {
    return null;
  }

  return (
    <Alert status="warning" flexWrap="wrap" whiteSpace="pre-wrap">
      { proxyInfo.link ? (
        <>
          This proxy smart-contract is detected via <LinkExternal href={ proxyInfo.link }>{ proxyInfo.name }</LinkExternal>
          { proxyInfo.description && ` - ${ proxyInfo.description }` }
        </>
      ) : (
        <>
          This proxy smart-contract is detected via { proxyInfo.name }
          { proxyInfo.description && ` - ${ proxyInfo.description }` }
        </>
      ) }
    </Alert>
  );
};

export default React.memo(ContractCodeProxyPattern);
