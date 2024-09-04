import { Flex, GridItem, VStack } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2BlobTypeCelestia } from 'types/api/optimisticL2';

import dayjs from 'lib/date/dayjs';
import hexToBase64 from 'lib/hexToBase64';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

function getCeleniumUrl(blob: OptimisticL2BlobTypeCelestia) {
  const url = new URL('https://mocha.celenium.io/blob');
  url.searchParams.set('commitment', hexToBase64(blob.commitment));
  url.searchParams.set('hash', hexToBase64(blob.namespace));
  url.searchParams.set('height', String(blob.height));

  return url.toString();
}

interface Props {
  blobs: Array<OptimisticL2BlobTypeCelestia>;
}

const OptimisticL2TxnBatchBlobCelestia = ({ blobs }: Props) => {
  return (
    <VStack rowGap={ 2 }>
      { blobs.map((blob) => {
        return (
          <OptimisticL2TxnBatchBlobWrapper key={ blob.commitment } gridTemplateColumns="auto 1fr auto">
            <GridItem fontWeight={ 600 }>Commitment</GridItem>
            <GridItem overflow="hidden">
              <Flex minW="0" w="calc(100% - 20px)">
                <HashStringShortenDynamic hash={ blob.commitment }/>
                <CopyToClipboard text={ blob.commitment }/>
              </Flex>
            </GridItem>
            <GridItem display="flex" columnGap={ 2 }>
              <IconSvg name="brands/celenium" boxSize={ 5 }/>
              <LinkExternal href={ getCeleniumUrl(blob) }>Blob page</LinkExternal>
            </GridItem>
            <GridItem fontWeight={ 600 }>Hight</GridItem>
            <GridItem colSpan={ 2 }>
              { blob.height }
            </GridItem>
            <GridItem fontWeight={ 600 }>Timestamp</GridItem>
            <GridItem whiteSpace="normal" colSpan={ 2 }>
              { dayjs(blob.l1_timestamp).fromNow() } | { dayjs(blob.l1_timestamp).format('llll') }
            </GridItem>
            <GridItem fontWeight={ 600 }>L1 txn hash</GridItem>
            <GridItem overflow="hidden" colSpan={ 2 }>
              <TxEntityL1 hash={ blob.l1_transaction_hash } noIcon noCopy={ false }/>
            </GridItem>
          </OptimisticL2TxnBatchBlobWrapper>
        );
      }) }
    </VStack>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobCelestia);
