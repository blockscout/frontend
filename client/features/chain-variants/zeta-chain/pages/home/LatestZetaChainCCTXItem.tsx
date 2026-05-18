// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { CctxListItem } from '@blockscout/zetachain-cctx-types';

import AddressFromTo from 'client/slices/address/components/from-to/AddressFromTo';

import TxEntityZetaChainCC from 'client/features/chain-variants/zeta-chain/components/TxEntityZetaChainCC';
import ZetaChainCCTXReducedStatus from 'client/features/chain-variants/zeta-chain/components/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'client/features/chain-variants/zeta-chain/components/ZetaChainCCTXValue';

import { SECOND } from 'toolkit/utils/consts';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  tx: CctxListItem;
  isLoading?: boolean;
  animation?: string;
};

const LatestZetaChainCCTXItem = ({ tx, isLoading, animation }: Props) => {
  return (
    <Grid
      gridTemplateColumns="18px 120px 80px 350px auto"
      gridGap={ 3 }
      width="100%"
      minW="740px"
      borderBottom="1px solid"
      borderColor="border.divider"
      alignItems="center"
      p={ 4 }
      fontSize="sm"
      animation={ animation }

    >
      <ZetaChainCCTXReducedStatus status={ tx.status_reduced } isLoading={ isLoading }/>
      <TxEntityZetaChainCC truncation="constant" hash={ tx.index } isLoading={ isLoading } fontWeight={ 600 }/>
      <TimeWithTooltip color="text.secondary" timestamp={ Number(tx.last_update_timestamp) * SECOND } isLoading={ isLoading } timeFormat="relative"/>
      <AddressFromTo
        from={{ hash: tx.sender_address, chainId: tx.source_chain_id.toString(), chainType: 'zeta' }}
        to={{ hash: tx.receiver_address, chainId: tx.target_chain_id.toString(), chainType: 'zeta' }}
        isLoading={ isLoading }
      />
      <ZetaChainCCTXValue
        coinType={ tx.coin_type }
        tokenSymbol={ tx.token_symbol }
        amount={ tx.amount }
        decimals={ tx.decimals }
        isLoading={ isLoading }
      />
    </Grid>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
