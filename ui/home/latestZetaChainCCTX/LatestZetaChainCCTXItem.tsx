import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import ZetaChainAddressFromTo from 'ui/shared/zetaChain/ZetaChainAddressFromTo';
import ZetaChainCCTXStatusTag from 'ui/shared/zetaChain/ZetaChainCCTXStatusTag';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';

type Props = {
  tx: ZetaChainCCTX;
  isLoading?: boolean;
};

const LatestZetaChainCCTXItem = ({ tx, isLoading }: Props) => {
  return (
    <Grid
      gridTemplateColumns="18px 120px 80px 330px auto"
      gridGap={ 3 }
      width="100%"
      minW="740px"
      borderBottom="1px solid"
      borderColor="border.divider"
      alignItems="center"
      p={ 4 }
      fontSize="sm"
    >
      <ZetaChainCCTXStatusTag status={ tx.status_reduced } isLoading={ isLoading }/>
      <TxEntityZetaChainCC hash={ tx.index } isLoading={ isLoading } truncation="constant" fontWeight={ 600 }/>
      <TimeWithTooltip color="text.secondary" timestamp={ Number(tx.last_update_timestamp) * 1000 } isLoading={ isLoading } timeFormat="relative"/>
      <ZetaChainAddressFromTo tx={ tx } isLoading={ isLoading }/>
      <ZetaChainCCTXValue tx={ tx } isLoading={ isLoading } justifyContent="end"/>
    </Grid>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
