// SPDX-License-Identifier: LicenseRef-Blockscout

import { Separator } from '@chakra-ui/react';
import React from 'react';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import { route } from 'src/shared/router/routes';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';

import * as AddressEntity from './AddressEntity';

interface Props extends AddressEntity.EntityProps {
  tokenHash: string;
  tokenSymbol: string | undefined;
}

const AddressEntityWithTokenFilter = ({ tokenHash, tokenSymbol, ...props }: Props) => {

  const multiChainContext = useMultichainContext();

  const chainConfig = (multiChainContext?.chain.app_config ?? config);

  if (!chainConfig.features.advancedFilter.isEnabled) {
    return <AddressEntity.default { ...props }/>;
  }

  const filterHref = route({
    pathname: '/advanced-filter',
    query: {
      ...props.query,
      to_address_hashes_to_include: [ props.address.hash ],
      from_address_hashes_to_include: [ props.address.hash ],
      token_contract_address_hashes_to_include: [ tokenHash ],
      ...(tokenSymbol ? { token_contract_symbols_to_include: [ tokenSymbol ] } : {}),
    },
  }, { chain: multiChainContext?.chain });

  const tooltipContentAfter = (
    <>
      <Separator my={ 1 } className="dark"/>
      <Link href={ filterHref } display="flex" alignItems="center" justifyContent="center" gap={ 2 } fontWeight={ 500 } className="dark" textStyle="xs">
        <SpriteIcon name="advanced-filter" boxSize={ 5 }/>
        <span>View all token transfers for this address and token</span>
      </Link>
    </>
  );

  return (
    <AddressEntity.Container { ...props }>
      <AddressEntity.Icon/>
      <AddressEntity.Link>
        <AddressEntity.Content tooltipInteractive tooltipContentAfter={ tooltipContentAfter }/>
      </AddressEntity.Link>
      <AddressEntity.Copy/>
    </AddressEntity.Container>
  );
};

export default AddressEntityWithTokenFilter;
