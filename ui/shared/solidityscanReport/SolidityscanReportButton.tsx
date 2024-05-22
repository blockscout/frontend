import { Button, Spinner, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import IconSvg from 'ui/shared/IconSvg';

import useScoreLevelAndColor from './useScoreLevelAndColor';

interface Props {
  score: number;
  isLoading?: boolean;
  onlyIcon?: boolean;
  onClick?: () => void;
  label?: string;
}

const SolidityscanReportButton = (
  { score, isLoading, onlyIcon, onClick, label = 'Security score' }: Props,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const { scoreColor } = useScoreLevelAndColor(score);
  const colorLoading = useColorModeValue('gray.300', 'gray.600');
  const isMobile = useIsMobile();

  return (
    <Tooltip label={ label } isDisabled={ isMobile } openDelay={ 100 }>
      <Button
        ref={ ref }
        color={ isLoading ? colorLoading : scoreColor }
        size="sm"
        variant="outline"
        colorScheme="gray"
        onClick={ onClick }
        aria-label="SolidityScan score"
        fontWeight={ 500 }
        px="6px"
        flexShrink={ 0 }
        columnGap={ 1 }
        isDisabled={ isLoading }
        _disabled={{
          opacity: 1,
          _hover: {
            color: colorLoading,
          },
        }}
      >
        <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } boxSize={ 5 }/>
        { isLoading && <Spinner size="sm"/> }
        { !isLoading && (onlyIcon ? null : score) }
      </Button>
    </Tooltip>
  );
};

export default React.forwardRef(SolidityscanReportButton);
