import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import TxEntity from 'ui/shared/entities/tx/TxEntity';
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
      gridTemplateColumns="18px 140px 80px 350px auto"
      gridGap={ 3 }
      width="100%"
      minW="740px"
      borderBottom="1px solid"
      borderColor="border.divider"
      alignItems="center"
      p={ 4 }
      display={{ base: 'none', lg: 'grid' }}
    >
      <ZetaChainCCTXStatusTag status={ tx.status_reduced } isLoading={ isLoading }/>
      <TxEntity hash={ tx.index } isLoading={ isLoading } truncation="constant" fontWeight={ 600 }/>
      <TimeWithTooltip color="text.secondary" timestamp={ Number(tx.last_update_timestamp) * 1000 } isLoading={ isLoading } timeFormat="relative"/>
      <ZetaChainAddressFromTo tx={ tx } isLoading={ isLoading }/>
      <ZetaChainCCTXValue tx={ tx } isLoading={ isLoading }/>
    </Grid>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
