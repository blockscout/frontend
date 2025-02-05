import { Flex } from '@chakra-ui/react';
import React from 'react';

import { Link } from 'toolkit/chakra/link';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  items: Array<string>;
}

const CUT_LENGTH = 2;

// TODO @tom2drum another variant of CutLink
const TxAllowedPeekers = ({ items }: Props) => {
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleCutLinkClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
  }, []);

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
            onClick={ handleCutLinkClick }
          >
            { isExpanded ? 'Hide' : 'Show all' }
          </Link>
        ) }
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(TxAllowedPeekers);
