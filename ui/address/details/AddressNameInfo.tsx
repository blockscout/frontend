import { Link } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';

import link from 'lib/link/link';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  data: Address;
}

const AddressNameInfo = ({ data }: Props) => {
  if (data.token) {
    return (
      <DetailsInfoItem
        title="Token name"
        hint="Token name and symbol"
      >
        <Link href={ link('token_index', { hash: data.token.address }) }>
          { data.token.name } ({ data.token.symbol })
        </Link>
      </DetailsInfoItem>
    );
  }

  if (data.is_contract && data.name) {
    return (
      <DetailsInfoItem
        title="Contract name"
        hint="The name found in the source code of the Contract"
      >
        { data.name }
      </DetailsInfoItem>
    );
  }

  if (data.name) {
    return (
      <DetailsInfoItem
        title="Validator name"
        hint="The name of the validator"
      >
        { data.name }
      </DetailsInfoItem>
    );
  }

  return null;
};

export default React.memo(AddressNameInfo);
