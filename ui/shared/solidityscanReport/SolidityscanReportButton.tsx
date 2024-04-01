import { Button, Skeleton } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import useScoreLevelAndColor from './useScoreLevelAndColor';

interface Props {
  className?: string;
  score: number;
  isLoading?: boolean;
  height?: string;
  onlyIcon?: boolean;
  onClick?: () => void;
}

const SolidityscanReportButton = (
  { className, score, isLoading, height = '32px', onlyIcon, onClick }: Props,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const { scoreColor } = useScoreLevelAndColor(score);

  return (
    <Skeleton isLoaded={ !isLoading } borderRadius="base">
      <Button
        ref={ ref }
        className={ className }
        color={ scoreColor }
        size="sm"
        variant="outline"
        colorScheme="gray"
        onClick={ onClick }
        aria-label="SolidityScan score"
        fontWeight={ 500 }
        px="6px"
        h={ height }
        flexShrink={ 0 }
      >
        <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } boxSize={ 5 } mr={ onlyIcon ? 0 : 1 }/>
        { onlyIcon ? null : score }
      </Button>
    </Skeleton>
  );
};

export default React.forwardRef(SolidityscanReportButton);
