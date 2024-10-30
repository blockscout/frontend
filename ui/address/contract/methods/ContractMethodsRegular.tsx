import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractMethod } from './types';

import getQueryParamString from 'lib/router/getQueryParamString';

import ContractAbi from './ContractAbi';
import ContractConnectWallet from './ContractConnectWallet';
import ContractMethodsContainer from './ContractMethodsContainer';
import ContractMethodsFilters from './ContractMethodsFilters';
import useMethodsFilters from './useMethodsFilters';

interface Props {
  abi: Array<SmartContractMethod>;
  isLoading?: boolean;
}

const ContractMethodsRegular = ({ abi, isLoading }: Props) => {

  const router = useRouter();

  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);

  const filters = useMethodsFilters({ abi });

  return (
    <Flex flexDir="column" rowGap={ 6 }>
      <ContractConnectWallet isLoading={ isLoading }/>
      <ContractMethodsFilters
        defaultMethodType={ filters.methodType }
        defaultSearchTerm={ filters.searchTerm }
        onChange={ filters.onChange }
        isLoading={ isLoading }
      />
      <ContractMethodsContainer isLoading={ isLoading } isEmpty={ abi.length === 0 } type={ filters.methodType }>
        <ContractAbi abi={ abi } tab={ tab } addressHash={ addressHash } visibleItems={ filters.visibleItems }/>
      </ContractMethodsContainer>
    </Flex>
  );
};

export default React.memo(ContractMethodsRegular);
