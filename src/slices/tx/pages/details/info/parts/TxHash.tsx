// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import TextSeparator from 'src/shared/texts/TextSeparator';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

interface Props {
  hash: string;
  isLoading: boolean;
  status: schemas['Transaction']['status'];
}

const TxHash = ({ hash, isLoading, status }: Props) => {
  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Unique character string (TxID) assigned to every verified transaction"
        isLoading={ isLoading }
      >
        Transaction hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Flex flexWrap="nowrap" alignItems="center" overflow="hidden">
          { status === null && <Spinner mr={ 2 } size="sm" flexShrink={ 0 }/> }
          <Skeleton loading={ isLoading } overflow="hidden">
            <Truncate value={ hash }/>
          </Skeleton>
          <CopyToClipboard text={ hash } isLoading={ isLoading }/>
          { config.features.metasuites.isEnabled && (
            <>
              <TextSeparator flexShrink={ 0 } display="none" id="meta-suites__tx-explorer-separator"/>
              <Box display="none" flexShrink={ 0 } id="meta-suites__tx-explorer-link"/>
            </>
          ) }
        </Flex>
      </DetailedInfo.ItemValue>

    </>
  );
};

export default React.memo(TxHash);
