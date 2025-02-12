import { Spinner } from '@chakra-ui/react';
import React from 'react';

import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import type { ButtonProps } from 'toolkit/chakra/button';
import { Button } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import useScoreLevelAndColor from './useScoreLevelAndColor';

interface Props extends ButtonProps {
  score: number;
  isLoading?: boolean;
  onlyIcon?: boolean;
  isActive?: boolean;
  label?: string | React.ReactElement;
}

const SolidityscanReportButton = (
  { score, isLoading, onlyIcon, isActive, label = 'Security score', ...rest }: Props,
) => {
  const { scoreColor } = useScoreLevelAndColor(score);
  const colorLoading = { _light: 'gray.300', _dark: 'gray.600' };
  const onFocusCapture = usePreventFocusAfterModalClosing();

  return (
    <Tooltip content={ label } disableOnMobile disabled={ isActive }>
      <Button
        color={ isLoading ? colorLoading : scoreColor }
        size="sm"
        variant="dropdown"
        expanded={ isActive }
        aria-label="SolidityScan score"
        fontWeight={ 500 }
        px="6px"
        flexShrink={ 0 }
        columnGap={ 1 }
        disabled={ isLoading }
        _expanded={{ color: 'link.primary.hover' }}
        _disabled={{
          opacity: 1,
          _hover: {
            color: colorLoading,
          },
        }}
        onFocusCapture={ onFocusCapture }
        { ...rest }
      >
        <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } boxSize={ 5 }/>
        { isLoading && <Spinner size="sm"/> }
        { !isLoading && (onlyIcon ? null : score) }
      </Button>
    </Tooltip>
  );
};

export default SolidityscanReportButton;
