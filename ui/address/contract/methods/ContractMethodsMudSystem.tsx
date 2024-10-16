import { Box } from '@chakra-ui/react';
import React from 'react';

import type { AddressImplementation } from 'types/api/addressParams';

import useApiQuery from 'lib/api/useApiQuery';

import ContractConnectWallet from './ContractConnectWallet';
import ContractMethods from './ContractMethods';
import ContractSourceAddressSelector from './ContractSourceAddressSelector';
import { isMethod } from './utils';

interface Props {
  items: Array<AddressImplementation>;
  isLoading?: boolean;
}

const ContractMethodsMudSystem = ({ items, isLoading: isInitialLoading }: Props) => {

  const [ selectedItem, setSelectedItem ] = React.useState(items[0]);

  const contractQuery = useApiQuery('contract', {
    pathParams: { hash: selectedItem.address },
    queryOptions: {
      enabled: Boolean(selectedItem.address),
      refetchOnMount: false,
    },
  });

  const abi = contractQuery.data?.abi?.filter(isMethod) || [];

  return (
    <Box>
      <ContractConnectWallet isLoading={ isInitialLoading }/>
      <ContractSourceAddressSelector
        items={ items }
        selectedItem={ selectedItem }
        onItemSelect={ setSelectedItem }
        isLoading={ isInitialLoading }
        label="System address"
      />
      <ContractMethods
        key={ selectedItem.address }
        abi={ abi }
        isLoading={ isInitialLoading || contractQuery.isPending }
        isError={ contractQuery.isError }
        type="all"
      />
    </Box>
  );
};

export default React.memo(ContractMethodsMudSystem);
