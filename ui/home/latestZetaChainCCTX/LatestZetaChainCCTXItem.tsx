import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import AddressFromTo from 'ui/shared/address/AddressFromTo';
import CCTxEntityZetaChain from 'ui/shared/entities/tx/CCTxEntityZetaChain';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';

type Props = {
  tx: ZetaChainCCTX;
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
      <CCTxEntityZetaChain hash={ tx.index } isLoading={ isLoading } truncation="constant" fontWeight={ 600 }/>
      <TimeWithTooltip color="text.secondary" timestamp={ Number(tx.last_update_timestamp) * 1000 } isLoading={ isLoading } timeFormat="relative"/>
      <AddressFromTo
        from={{ hash: tx.sender_address }}
        to={{ hash: tx.receiver_address }}
        isLoading={ isLoading }
        zetaChainFromChainId={ tx.source_chain_id.toString() }
        zetaChainToChainId={ tx.target_chain_id.toString() }
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
