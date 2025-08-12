import type { HTMLChakraProps } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';

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
          <Image
            src={ feature.stageIndex === '1' ? '/static/labels/stage-1.svg' : '/static/labels/stage-2.svg' }
            h="14px"
            w="42px"
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
