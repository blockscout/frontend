import { Button, chakra, useColorModeValue, Tooltip } from '@chakra-ui/react';
import React from 'react';

import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  rating?: number;
  fullView?: boolean;
  isActive: boolean;
  onClick: () => void;
  canRate: boolean | undefined;
};

const getTooltipText = (canRate: boolean | undefined) => {
  if (canRate === undefined) {
    return <>You need a connected wallet to leave your rating.<br/>Link your wallet to Blockscout first</>;
  }
  if (!canRate) {
    return <>New wallet users are not eligible to leave ratings.<br/>Please connect a different wallet</>;
  }
  return <>Ratings are derived from reviews by trusted users.<br/>Click here to rate!</>;
};

const TriggerButton = (
  { rating, fullView, isActive, onClick, canRate }: Props,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const textColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  const onFocusCapture = usePreventFocusAfterModalClosing();

  return (
    <Tooltip
      label={ getTooltipText(canRate) }
      openDelay={ 100 }
      textAlign="center"
      closeOnClick={ Boolean(canRate) }
    >
      <Button
        ref={ ref }
        size="xs"
        variant="outline"
        border={ 0 }
        p={ 0 }
        onClick={ canRate ? onClick : undefined }
        fontSize={ fullView ? 'md' : 'sm' }
        fontWeight={ fullView ? '400' : '500' }
        lineHeight="21px"
        ml={ fullView ? 3 : 0 }
        isActive={ isActive }
        onFocusCapture={ onFocusCapture }
        cursor={ canRate ? 'pointer' : 'default' }
      >
        { !fullView && (
          <IconSvg
            name={ rating ? 'star_filled' : 'star_outline' }
            color={ rating ? 'yellow.400' : 'gray.400' }
            boxSize={ 5 }
            mr={ 1 }
          />
        ) }
        { (rating && !fullView) ? (
          <chakra.span color={ textColor } transition="inherit">
            { rating }
          </chakra.span>
        ) : (
          'Rate it!'
        ) }
      </Button>
    </Tooltip>
  );
};

export default React.forwardRef(TriggerButton);
