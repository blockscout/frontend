import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import AddressIntTxsListItem from 'ui/address/internals/AddressIntTxsListItem';

type Props = {
  data: Array<InternalTransaction>;
  currentAddress: string;
  isLoading?: boolean;
};

const AddressIntTxsList = ({ data, currentAddress, isLoading }: Props) => {
  return (
    <Box>
      { data.map((item, index) => (
        <AddressIntTxsListItem
          key={ item.transaction_hash + '_' + index }
          { ...item }
          currentAddress={ currentAddress }
          isLoading={ isLoading }
        />
      )) }
    </Box>
  );
};

export default AddressIntTxsList;
