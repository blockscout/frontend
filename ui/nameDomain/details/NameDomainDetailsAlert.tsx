import { Alert } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import LinkExternal from 'ui/shared/links/LinkExternal';

interface Props {
  data: bens.DetailedDomain | undefined;
}

const NameDomainDetailsAlert = ({ data }: Props) => {

  if (!data?.stored_offchain && !data?.resolved_with_wildcard) {
    return null;
  }

  return (
    <Alert status="info" colorScheme="gray" display="inline-block" whiteSpace="pre-wrap" mb={ 6 }>
      <span>The domain name is resolved offchain using </span>
      { data.stored_offchain && <LinkExternal href="https://eips.ethereum.org/EIPS/eip-3668">EIP-3668: CCIP Read</LinkExternal> }
      { data.stored_offchain && data.resolved_with_wildcard && <span> & </span> }
      { data.resolved_with_wildcard && <LinkExternal href="https://eips.ethereum.org/EIPS/eip-2544">EIP-2544: Wildcard Resolution</LinkExternal> }
    </Alert>
  );
};

export default React.memo(NameDomainDetailsAlert);
