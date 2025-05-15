import React from 'react';

import type { SmartContractProxyType } from 'types/api/contract';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

interface Props {
  type: NonNullable<SmartContractProxyType>;
  isLoading: boolean;
}

const PROXY_TYPES: Partial<Record<NonNullable<SmartContractProxyType>, {
  name: string;
  link?: string;
  description?: string;
}>> = {
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
  erc7760: {
    name: 'ERC-7760',
    link: 'https://eips.ethereum.org/EIPS/eip-7760',
    description: 'Minimal Upgradeable Proxies',
  },
  resolved_delegate_proxy: {
    name: 'ResolvedDelegateProxy',
    // eslint-disable-next-line max-len
    link: 'https://github.com/ethereum-optimism/optimism/blob/9580179013a04b15e6213ae8aa8d43c3f559ed9a/packages/contracts-bedrock/src/legacy/ResolvedDelegateProxy.sol',
    description: 'OP stack: legacy proxy contract that makes use of the AddressManager to resolve the implementation address',
  },
  clone_with_immutable_arguments: {
    name: 'Clones with immutable arguments',
    link: 'https://github.com/wighawag/clones-with-immutable-args',
  },
  master_copy: {
    name: 'Safe proxy',
    link: 'https://github.com/safe-global/safe-smart-account',
  },
  comptroller: {
    name: 'Compound protocol proxy',
    link: 'https://github.com/compound-finance/compound-protocol',
  },
  basic_implementation: {
    name: 'public implementation() getter',
  },
  basic_get_implementation: {
    name: 'public getImplementation() getter',
  },
  unknown: {
    name: 'Unknown proxy pattern',
  },
};

const ContractCodeProxyPattern = ({ type, isLoading }: Props) => {
  const proxyInfo = PROXY_TYPES[type];

  if (!proxyInfo || type === 'unknown') {
    return null;
  }

  return (
    <Alert status="warning" whiteSpace="pre-wrap" loading={ isLoading }>
      { proxyInfo.link ? (
        <>
          This proxy smart-contract is detected via <Link href={ proxyInfo.link } external>{ proxyInfo.name }</Link>
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
