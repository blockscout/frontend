import { Flex, Link, useBoolean } from '@chakra-ui/react';
import React from 'react';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  items: Array<string>;
}

const CUT_LENGTH = 2;

const TxAllowedPeekers = ({ items }: Props) => {
  const [ isExpanded, expand ] = useBoolean(false);

  return (
    <>
      <DetailsInfoItem.Label
        hint="Smart contracts allowed to interact with confidential data"
      >
        Allowed peekers
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Flex flexDir="column" rowGap={ 3 } w="100%">
          { items
            .slice(0, isExpanded ? undefined : CUT_LENGTH)
            .map((item) => <AddressEntity key={ item } address={{ hash: item, is_contract: true }}/>) }
        </Flex>
        { items.length > CUT_LENGTH && (
          <Link
            display="inline-block"
            fontSize="sm"
            textDecorationLine="underline"
            textDecorationStyle="dashed"
            onClick={ expand.toggle }
          >
            { isExpanded ? 'Hide' : 'Show all' }
          </Link>
        ) }
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(TxAllowedPeekers);
