import React from 'react';

import config from 'configs/app';
import type { ImageProps } from 'toolkit/chakra/image';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props extends ImageProps {
  chainConfig?: typeof config;
  variant?: 'outline' | 'filled';
}

const RollupStageBadge = ({ chainConfig = config, variant = 'outline', ...props }: Props) => {

  const feature = chainConfig.features.rollup;

  if (!feature.isEnabled || chainConfig.chain.isTestnet) {
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

      const src = (() => {
        if (variant === 'filled') {
          return feature.stageIndex === '1' ? '/static/labels/stage-1-filled.svg' : '/static/labels/stage-2-filled.svg';
        }

        return feature.stageIndex === '1' ? '/static/labels/stage-1.svg' : '/static/labels/stage-2.svg';
      })();

      return (
        <Tooltip content={ tooltipContent } interactive>
          <Image
            src={ src }
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
