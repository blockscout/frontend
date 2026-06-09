// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid, VStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { CctxListItem } from '@blockscout/zetachain-cctx-types';

import AddressEntityZetaChain from 'src/features/chain-variants/zeta-chain/components/AddressEntityZetaChain';
import TxEntityZetaChainCC from 'src/features/chain-variants/zeta-chain/components/TxEntityZetaChainCC';
import ZetaChainCCTXReducedStatus from 'src/features/chain-variants/zeta-chain/components/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'src/features/chain-variants/zeta-chain/components/ZetaChainCCTXValue';

import dayjs from 'src/shared/date-and-time/dayjs';
import Time from 'src/shared/date-and-time/Time';
import TextSeparator from 'src/shared/texts/TextSeparator';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { SECOND } from 'src/toolkit/utils/consts';

type Props = {
  tx: CctxListItem;
  isLoading?: boolean;
  animation?: string;
};

const LatestZetaChainCCTXItem = ({ tx, isLoading, animation }: Props) => {
  return (
    <VStack
      width="100%"
      borderBottom="1px solid"
      borderColor="border.divider"
      py={ 3 }
      fontSize="sm"
      alignItems="start"
      gap={ 2 }
      animation={ animation }
    >
      <ZetaChainCCTXReducedStatus status={ tx.status_reduced } isLoading={ isLoading } type="full"/>
      <TxEntityZetaChainCC hash={ tx.index } isLoading={ isLoading } truncation="constant_long" fontWeight={ 600 }/>
      <Skeleton loading={ isLoading } display="flex" color="text.secondary" gap={ 2 } justifyContent="start">
        { dayjs(Number(tx.last_update_timestamp) * SECOND).fromNow() }
        <TextSeparator mx={ 0 }/>
        <Time timestamp={ Number(tx.last_update_timestamp) * SECOND } format="lll_s"/>
      </Skeleton>
      <Grid gridTemplateColumns="100px 1fr" gap={ 2 }>
        <Text>Sender</Text>
        <AddressEntityZetaChain
          address={{ hash: tx.sender_address }}
          chainId={ tx.source_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text>Receiver</Text>
        <AddressEntityZetaChain
          address={{ hash: tx.receiver_address }}
          chainId={ tx.target_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <Text>Asset</Text>
        <ZetaChainCCTXValue
          coinType={ tx.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ tx.amount }
          decimals={ tx.decimals }
          isLoading={ isLoading }
        />
      </Grid>
    </VStack>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
