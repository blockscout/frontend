// SPDX-License-Identifier: LicenseRef-Blockscout

import { upperFirst } from 'es-toolkit';
import React from 'react';

import config from 'src/config';
import StatsContainer from 'src/shared/stats/StatsContainer';
import StatsWidget from 'src/shared/stats/StatsWidget';

import { SECOND } from 'src/toolkit/utils/consts';

const flashblocksFeature = config.features.flashblocks;

interface Props {
  itemsNum: number;
  txsNum: number;
  initialTs: number | undefined;
}

const FlashblocksStats = ({ itemsNum, txsNum, initialTs }: Props) => {

  const timeElapsed = initialTs ? Date.now() - initialTs : undefined;

  if (!flashblocksFeature.isEnabled) {
    return null;
  }

  return (
    <StatsContainer mb={ 6 }>
      <StatsWidget
        label={ `${ upperFirst(flashblocksFeature.name) }s (sec)` }
        value={ timeElapsed ? Number(itemsNum / (timeElapsed / SECOND)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-' }
      />
      <StatsWidget
        label="TPS"
        value={ timeElapsed && txsNum > 0 ? Number(txsNum / (timeElapsed / SECOND)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-' }
      />
      <StatsWidget
        label={ `${ upperFirst(flashblocksFeature.name) } time` }
        value={
          timeElapsed && itemsNum > 0 ?
            Number(timeElapsed / itemsNum).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ms' :
            '-'
        }
      />
    </StatsContainer>
  );
};

export default React.memo(FlashblocksStats);
