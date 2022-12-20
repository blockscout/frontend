import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import AddressIntTxsListItem from 'ui/address/internals/AddressIntTxsListItem';

type Props = {
  data: Array<InternalTransaction>;
  currentAddress: string;
}

const AddressIntTxsList = ({ data, currentAddress }: Props) => {
  return (
    <Box>
      { data.map((item) => <AddressIntTxsListItem key={ item.transaction_hash } { ...item } currentAddress={ currentAddress }/>) }
    </Box>
  );
};

export default AddressIntTxsList;
