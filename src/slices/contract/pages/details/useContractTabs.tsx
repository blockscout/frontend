// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Channel } from 'phoenix';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ContractDetails from 'src/slices/contract/pages/details/code/ContractCode';
import ContractMethodsCustom from 'src/slices/contract/pages/details/methods/ContractMethodsCustom';
import ContractMethodsProxy from 'src/slices/contract/pages/details/methods/ContractMethodsProxy';
import ContractMethodsRegular from 'src/slices/contract/pages/details/methods/ContractMethodsRegular';
import * as stubs from 'src/slices/contract/stubs';

import config from 'src/config';

import type { CONTRACT_MAIN_TAB_IDS } from '../../utils/tabs';
import { CONTRACT_DETAILS_TAB_IDS } from '../../utils/tabs';

interface ContractTab {
  id: typeof CONTRACT_MAIN_TAB_IDS[number] | Array<typeof CONTRACT_MAIN_TAB_IDS[number]>;
  title: string;
  component: React.JSX.Element;
  subTabs?: Array<string>;
}

interface ReturnType {
  tabs: Array<ContractTab>;
  isLoading: boolean;
  isPartiallyVerified?: boolean;
}

interface Props {
  addressData: schemas['AddressResponse'] | undefined;
  isEnabled: boolean;
  channel?: Channel;
  chain?: ClusterChainConfig;
}

export default function useContractTabs({ addressData, isEnabled, channel, chain }: Props): ReturnType {
  const contractQuery = useApiQuery('core:contract', {
    pathParams: { hash: addressData?.hash },
    queryOptions: {
      enabled: isEnabled && Boolean(addressData?.is_contract),
      refetchOnMount: false,
      placeholderData: addressData?.is_verified ? stubs.CONTRACT_CODE_VERIFIED : stubs.CONTRACT_CODE_UNVERIFIED,
    },
    chain,
  });

  const verifiedImplementations = React.useMemo(() => {
    return addressData?.implementations?.filter(({ name, address_hash: addressHash }) => name && addressHash && addressHash !== addressData?.hash) || [];
  }, [ addressData?.hash, addressData?.implementations ]);

  return React.useMemo(() => {

    if (!addressData?.is_contract) {
      return {
        tabs: [
          {
            id: 'contract_code' as const,
            title: 'Code',
            component: <p>This address is not a contract on this chain.</p>,
          },
        ],
        isLoading: false,
        isPartiallyVerified: undefined,
      };
    }

    return {
      tabs: [
        addressData && {
          id: 'contract_code' as const,
          title: 'Code',
          component: <ContractDetails mainContractQuery={ contractQuery } channel={ channel } addressData={ addressData }/>,
          subTabs: CONTRACT_DETAILS_TAB_IDS as unknown as Array<string>,
        },
        contractQuery.data?.abi && {
          id: [ 'read_write_contract' as const, 'read_contract' as const, 'write_contract' as const ],
          title: 'Read/Write contract',
          component: <ContractMethodsRegular abi={ contractQuery.data.abi } isLoading={ contractQuery.isPlaceholderData }/>,
        },
        verifiedImplementations.length > 0 && {
          id: [ 'read_write_proxy' as const, 'read_proxy' as const, 'write_proxy' as const ],
          title: 'Read/Write proxy',
          component: (
            <ContractMethodsProxy
              implementations={ verifiedImplementations }
              isLoading={ contractQuery.isPlaceholderData }
              proxyType={ addressData?.proxy_type }
              conflictingImplementations={ contractQuery.data?.conflicting_implementations ?? undefined }
            />
          ),
        },
        config.features.account.isEnabled && {
          id: [ 'read_write_custom_methods' as const, 'read_custom_methods' as const, 'write_custom_methods' as const ],
          title: 'Custom ABI',
          component: <ContractMethodsCustom isLoading={ contractQuery.isPlaceholderData }/>,
        },
      ].filter(Boolean),
      isLoading: contractQuery.isPlaceholderData,
      isPartiallyVerified: !contractQuery.isPlaceholderData ? contractQuery.data?.is_partially_verified || undefined : undefined,
    };
  }, [
    addressData,
    contractQuery,
    channel,
    verifiedImplementations,
  ]);
}
