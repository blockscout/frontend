import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractMudSystemItem } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';

import type { Item } from '../ContractSourceAddressSelector';
import ContractSourceAddressSelector from '../ContractSourceAddressSelector';
import ContractConnectWallet from './ContractConnectWallet';
import ContractMethods from './ContractMethods';
import { enrichWithMethodId, isMethod } from './utils';

interface Props {
  items: Array<SmartContractMudSystemItem>;
}

const ContractMethodsMudSystem = ({ items }: Props) => {

  const router = useRouter();

  const addressHash = getQueryParamString(router.query.hash);
  const sourceAddress = getQueryParamString(router.query.source_address);

  const [ selectedItem, setSelectedItem ] = React.useState(items.find((item) => item.address === sourceAddress) || items[0]);

  const systemInfoQuery = useApiQuery('contract_mud_system_info', {
    pathParams: { hash: addressHash, system_address: selectedItem.address },
    queryOptions: {
      enabled: Boolean(selectedItem?.address),
      refetchOnMount: false,
    },
  });

  const handleItemSelect = React.useCallback((item: Item) => {
    setSelectedItem(item as SmartContractMudSystemItem);
  }, []);

  if (items.length === 0) {
    return <span>No MUD System found for this contract.</span>;
  }

  const abi = systemInfoQuery.data?.abi?.filter(isMethod).map(enrichWithMethodId) || [];

  return (
    <Box>
      <ContractConnectWallet/>
      <ContractSourceAddressSelector
        items={ items }
        selectedItem={ selectedItem }
        onItemSelect={ handleItemSelect }
        label="System address"
        mb={ 6 }
      />
      <ContractMethods
        key={ selectedItem.address }
        abi={ abi }
        isLoading={ systemInfoQuery.isPending }
        isError={ systemInfoQuery.isError }
        sourceAddress={ selectedItem.address }
        type="all"
      />
    </Box>
  );
};

export default React.memo(ContractMethodsMudSystem);
