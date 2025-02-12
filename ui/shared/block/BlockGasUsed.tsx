import { chakra, Tooltip, Box, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';

import GasUsedToTargetRatio from '../GasUsedToTargetRatio';
import TextSeparator from '../TextSeparator';
import Utilization from '../Utilization/Utilization';

const rollupFeature = config.features.rollup;

interface Props {
  className?: string;
  gasUsed?: string;
  gasLimit: string;
  gasTarget?: number;
  isLoading?: boolean;
}

const BlockGasUsed = ({ className, gasUsed, gasLimit, gasTarget, isLoading }: Props) => {
  const hasGasUtilization =
    gasUsed && gasUsed !== '0' &&
    (!rollupFeature.isEnabled || rollupFeature.type === 'optimistic' || rollupFeature.type === 'shibarium');

  const separatorColor = useColorModeValue('gray.200', 'gray.700');

  if (!hasGasUtilization) {
    return null;
  }

  return (
    <>
      <Tooltip label={ isLoading ? undefined : 'Gas Used %' }>
        <Box>
          <Utilization
            colorScheme="gray"
            value={ BigNumber(gasUsed).dividedBy(BigNumber(gasLimit)).toNumber() }
            isLoading={ isLoading }
            className={ className }
          />
        </Box>
      </Tooltip>
      { gasTarget && (
        <>
          <TextSeparator color={ separatorColor } mx={ 1 }/>
          <GasUsedToTargetRatio value={ gasTarget } isLoading={ isLoading }/>
        </>
      ) }
    </>
  );
};

export default React.memo(chakra(BlockGasUsed));
