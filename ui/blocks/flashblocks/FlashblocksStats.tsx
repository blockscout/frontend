import { Box } from '@chakra-ui/react';
import React from 'react';

import { SECOND } from 'toolkit/utils/consts';
import StatsWidget from 'ui/shared/stats/StatsWidget';

interface Props {
  itemsNum: number;
  txsNum: number;
  initialTs: number | undefined;
}

const FlashblocksStats = ({ itemsNum, txsNum, initialTs }: Props) => {

  const timeElapsed = initialTs ? Date.now() - initialTs : undefined;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: `repeat(3, calc(${ 100 / 3 }% - 9px))` }}
      gap={{ base: 1, lg: 3 }}
      mb={ 6 }
    >
      <StatsWidget
        label="Flashblocks (sec)"
        value={ timeElapsed ? Number(itemsNum / (timeElapsed / SECOND)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-' }
      />
      <StatsWidget
        label="TPS"
        value={ timeElapsed && txsNum > 0 ? Number(txsNum / (timeElapsed / SECOND)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-' }
      />
      <StatsWidget
        label="Flashblock time"
        value={
          timeElapsed && itemsNum > 0 ?
            Number(timeElapsed / itemsNum).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ms' :
            '-'
        }
      />
    </Box>
  );
};

export default React.memo(FlashblocksStats);
