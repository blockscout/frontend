import React from 'react';

import config from 'configs/app';
import { unknownAddress } from 'ui/shared/address/utils';
import AddressEntityWithExternalChain from 'ui/shared/entities/address/AddressEntityWithExternalChain';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

import AddressEntity from '../entities/address/AddressEntity';
import type { EntityProps as AddressEntityProps } from '../entities/address/AddressEntity';

type Props = {
  hash: string;
  chainId?: string;
  isLoading?: boolean;
  truncation?: AddressEntityProps['truncation'];
};

const ZetaChainAddressEntity = ({ hash, isLoading, chainId, truncation }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();

  if (chainId && chainId !== config.chain.id) {
    const chain = chainsConfig?.find((chain) => chain.chain_id.toString() === chainId);
    return (
      <AddressEntityWithExternalChain
        address={{ ...unknownAddress, hash }}
        isLoading={ isLoading }
        externalChain={ chain }
        truncation={ truncation }
      />
    );
  }

  return (
    <AddressEntity address={{ ...unknownAddress, hash }} isLoading={ isLoading } truncation={ truncation }/>
  );
};

export default ZetaChainAddressEntity;
