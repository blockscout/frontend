// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'client/slices/tx/types/api';

import useApiQuery from 'client/api/hooks/useApiQuery';

import TxExternalTxs from 'client/features/external-txs/components/TxExternalTxs';

import useIsMobile from 'client/shared/hooks/useIsMobile';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import TextSeparator from 'ui/shared/TextSeparator';

const externalTxFeature = config.features.externalTxs;

interface Props {
  hash: string;
  isLoading: boolean;
  status: Transaction['status'];
}

const TxHash = ({ hash, isLoading, status }: Props) => {
  const isMobile = useIsMobile();

  const externalTxsQuery = useApiQuery('general:tx_external_transactions', {
    pathParams: {
      hash,
    },
    queryOptions: {
      enabled: externalTxFeature.isEnabled,
      placeholderData: [ '1', '2', '3' ],
    },
  });

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Unique character string (TxID) assigned to every verified transaction"
        isLoading={ isLoading }
      >
        Transaction hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow={ config.features.externalTxs.isEnabled && externalTxsQuery.data && externalTxsQuery.data.length > 0 }>
        <Flex flexWrap="nowrap" alignItems="center" overflow="hidden">
          { status === null && <Spinner mr={ 2 } size="sm" flexShrink={ 0 }/> }
          <Skeleton loading={ isLoading } overflow="hidden">
            <HashStringShortenDynamic hash={ hash }/>
          </Skeleton>
          <CopyToClipboard text={ hash } isLoading={ isLoading }/>
          { config.features.metasuites.isEnabled && (
            <>
              <TextSeparator flexShrink={ 0 } display="none" id="meta-suites__tx-explorer-separator"/>
              <Box display="none" flexShrink={ 0 } id="meta-suites__tx-explorer-link"/>
            </>
          ) }
        </Flex>
        { config.features.externalTxs.isEnabled && externalTxsQuery.data && externalTxsQuery.data.length > 0 && (
          <Skeleton loading={ isLoading || externalTxsQuery.isPlaceholderData } display={{ base: 'block', lg: 'inline-flex' }} alignItems="center">
            { !isMobile && <TextSeparator flexShrink={ 0 }/> }
            <TxExternalTxs data={ externalTxsQuery.data }/>
          </Skeleton>
        ) }
      </DetailedInfo.ItemValue>

    </>
  );
};

export default React.memo(TxHash);
