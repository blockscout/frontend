import type { HTMLChakraProps } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

const feature = config.features.rollup;

const RollupStageBadge = (props: HTMLChakraProps<'div'>) => {
  if (!feature.isEnabled || config.chain.isTestnet) {
    return null;
  }

  switch (feature.stageIndex) {
    case '1':
    case '2': {
      const tooltipContent = (
        <>
          The decentralization and maturity of the chain. Learn more at{ ' ' }
          <Link href="https://l2beat.com?utm_source=blockscout&utm_medium=explorer" external>
            l2beat.com
          </Link>
        </>
      );

      return (
        <Tooltip content={ tooltipContent } interactive>
          <IconSvg
            name={ feature.stageIndex === '1' ? 'rollup/stage-1' : 'rollup/stage-2' }
            h="14px"
            w="42px"
            color={ feature.stageIndex === '1' ? 'yellow.500' : 'green.400' }
            { ...props }
          />
        </Tooltip>
      );
    }
    default:
      return null;
  }
};

export default React.memo(RollupStageBadge);
