import { route } from 'nextjs-routes';
import React from 'react';

import type { Address } from 'types/api/address';

import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  data: Pick<Address, 'name' | 'token' | 'is_contract'>;
}

const AddressNameInfo = ({ data }: Props) => {
  if (data.token) {
    const symbol = data.token.symbol ? ` (${ trimTokenSymbol(data.token.symbol) })` : '';
    return (
      <DetailsInfoItem
        title="Token name"
        hint="Token name and symbol"
      >
        <LinkInternal href={ route({ pathname: '/token/[hash]', query: { hash: data.token.address } }) }>
          { data.token.name || 'Unnamed token' }{ symbol }
        </LinkInternal>
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
