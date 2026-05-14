// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'client/slices/address/types/api';
import type { SmartContract } from 'client/slices/contract/types/api';

import CodeViewSnippet from 'ui/shared/CodeViewSnippet';

import type { CONTRACT_DETAILS_TAB_IDS } from '../../../utils/tabs';
import ContractDetailsByteCode from './ContractDetailsByteCode';
import ContractDetailsConstructorArgs from './ContractDetailsConstructorArgs';
import ContractSourceCode from './ContractSourceCode';

interface Tab {
  id: typeof CONTRACT_DETAILS_TAB_IDS[number];
  title: string;
  component: React.ReactNode;
}

interface Props {
  data: SmartContract | undefined;
  isLoading: boolean;
  addressData: Address;
  sourceAddress: string | undefined;
}

export default function useContractCodeTabs({ data, isLoading, addressData, sourceAddress }: Props): Array<Tab> {

  return React.useMemo(() => {

    if (!sourceAddress) {
      return [];
    }

    return [
      (data?.constructor_args || data?.source_code) ? {
        id: 'contract_source_code' as const,
        title: 'Code',
        component: (
          <Flex flexDir="column" rowGap={ 6 }>
            <ContractDetailsConstructorArgs data={ data } isLoading={ isLoading }/>
            { data?.source_code && (
              <ContractSourceCode
                data={ data }
                isLoading={ isLoading }
                sourceAddress={ sourceAddress }
              />
            ) }
          </Flex>
        ),
      } : undefined,

      data?.compiler_settings ? {
        id: 'contract_compiler' as const,
        title: 'Compiler',
        component: (
          <CodeViewSnippet
            data={ JSON.stringify(data.compiler_settings, undefined, 2) }
            language="json"
            title="Compiler Settings"
            copyData={ JSON.stringify(data.compiler_settings) }
            isLoading={ isLoading }
          />
        ),
      } : undefined,

      data?.abi ? {
        id: 'contract_abi' as const,
        title: 'ABI',
        component: (
          <CodeViewSnippet
            data={ JSON.stringify(data.abi, undefined, 2) }
            language="json"
            title="Contract ABI"
            copyData={ JSON.stringify(data.abi) }
            isLoading={ isLoading }
          />
        ),
      } : undefined,

      (data?.creation_bytecode || data?.deployed_bytecode) ? {
        id: 'contract_bytecode' as const,
        title: 'Bytecode',
        component: <ContractDetailsByteCode data={ data } isLoading={ isLoading } addressData={ addressData }/>,
      } : undefined,
    ].filter(Boolean);
  }, [ isLoading, addressData, data, sourceAddress ]);
}
