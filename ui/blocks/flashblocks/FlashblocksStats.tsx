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
      rowGap={ 3 }
      columnGap={ 3 }
      mb={ 6 }
    >
      <StatsWidget
        label="Flashblocks"
        value={ Number(itemsNum).toLocaleString() }
      />
      <StatsWidget
        label="TPS"
        value={ timeElapsed ? Number(txsNum / (timeElapsed / SECOND)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-' }
      />
      <StatsWidget
        label="Flashblock time"
        value={ timeElapsed ? Number(timeElapsed / itemsNum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ms' : '-' }
      />
    </Box>
  );
};

export default React.memo(FlashblocksStats);
