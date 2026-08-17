// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Grid } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TruncatedText } from 'src/toolkit/components/truncation/TruncatedText';

/** One call of a sponsored batch transaction. `to` is `null` for a contract-creation call. */
type TransactionEdenCall = NonNullable<schemas['TransactionResponse']['calls']>[number];

interface Props {
  data: schemas['TransactionResponse'];
  isLoading?: boolean;
}

const HeaderItem = ({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) => {
  return (
    <Skeleton
      fontWeight="semibold"
      pb={ 1 }
      loading={ isLoading }
    >
      { children }
    </Skeleton>
  );
};

const CallRow = ({ to, value, input, isLoading }: TransactionEdenCall & { isLoading?: boolean }) => {
  return (
    <>
      <div>
        { to ?
          <AddressEntity address={{ hash: to }} isLoading={ isLoading }/> :
          <Skeleton loading={ isLoading } display="inline-block"><span>[ Contract creation ]</span></Skeleton>
        }
      </div>
      <div>
        <NativeCoinValue amount={ value } loading={ isLoading }/>
      </div>
      <Flex alignItems="flex-start" whiteSpace="normal" wordBreak="break-all">
        <TruncatedText text={ input } loading={ isLoading }/>
        <CopyToClipboard text={ input } isLoading={ isLoading }/>
      </Flex>
    </>
  );
};

const TxDetailsEden = ({ data, isLoading }: Props) => {
  const { fee_payer: feePayer, calls } = data;

  if (!feePayer && !calls?.length) {
    return null;
  }

  return (
    <>
      { feePayer && (
        <>
          <DetailedInfo.ItemLabel
            hint="Address that paid the transaction fee on behalf of the sender"
            isLoading={ isLoading }
          >
            Fee payer
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity address={ feePayer } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { calls && calls.length > 0 && (
        <>
          <DetailedInfo.ItemLabel
            hint="Ordered list of calls batched into this sponsored transaction"
            isLoading={ isLoading }
          >
            Calls
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue alignItems="flex-start" flexWrap="wrap">
            <Grid
              gridTemplateColumns="minmax(140px, 1fr) minmax(50px, 1fr) 1fr"
              textStyle="sm"
              bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
              p={ 4 }
              mt={ 2 }
              w="100%"
              columnGap={ 5 }
              rowGap={ 5 }
              borderRadius="md"
            >
              <HeaderItem isLoading={ isLoading }>To</HeaderItem>
              <HeaderItem isLoading={ isLoading }>Value</HeaderItem>
              <HeaderItem isLoading={ isLoading }>Input</HeaderItem>
              { calls.map((call, index) => (
                // a batch can repeat the same call, so the position in the batch is the only stable key
                <CallRow key={ index } { ...call } isLoading={ isLoading }/>
              )) }
            </Grid>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(TxDetailsEden);
