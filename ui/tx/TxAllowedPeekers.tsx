import { Flex, Link, useBoolean } from '@chakra-ui/react';
import React from 'react';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  items: Array<string>;
}

const CUT_LENGTH = 2;

const TxAllowedPeekers = ({ items }: Props) => {
  const [ isExpanded, expand ] = useBoolean(false);

  return (
    <DetailsInfoItem
      title="Allowed peekers"
      hint="Smart contracts allowed to interact with confidential data"
    >
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
    </DetailsInfoItem>
  );
};

export default React.memo(TxAllowedPeekers);
