import { Button, chakra, useColorModeValue, Tooltip, useDisclosure, Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  rating?: number;
  count?: number;
  fullView?: boolean;
  isActive: boolean;
  onClick: () => void;
  canRate: boolean | undefined;
};

const getTooltipText = (canRate: boolean | undefined) => {
  if (canRate === undefined) {
    return <>Please connect your wallet to Blockscout to rate this DApp.<br/>Only wallets with 5+ transactions are eligible</>;
  }
  if (!canRate) {
    return <>Brand new wallets cannot leave ratings.<br/>Please connect a wallet with 5 or more transactions on this chain</>;
  }
  return <>Ratings come from verified users.<br/>Click here to rate!</>;
};

const TriggerButton = (
  { rating, count, fullView, isActive, onClick, canRate }: Props,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const textColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  const onFocusCapture = usePreventFocusAfterModalClosing();

  // have to implement controlled tooltip on mobile because of the issue - https://github.com/chakra-ui/chakra-ui/issues/7107
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isMobile = useIsMobile();

  const handleClick = React.useCallback(() => {
    if (canRate) {
      onClick();
    } else if (isMobile) {
      onToggle();
    }
  }, [ canRate, isMobile, onToggle, onClick ]);

  return (
    <Tooltip
      label={ getTooltipText(canRate) }
      openDelay={ 100 }
      textAlign="center"
      closeOnClick={ Boolean(canRate) || isMobile }
      isOpen={ isMobile ? isOpen : undefined }
    >
      <Button
        ref={ ref }
        size="xs"
        variant="outline"
        border={ 0 }
        p={ 0 }
        onClick={ handleClick }
        fontSize={ fullView ? 'md' : 'sm' }
        fontWeight={ fullView ? '400' : '500' }
        lineHeight="21px"
        ml={ fullView ? 3 : 0 }
        isActive={ isActive }
        onFocusCapture={ onFocusCapture }
        cursor={ canRate ? 'pointer' : 'default' }
        onMouseLeave={ isMobile ? onClose : undefined }
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
          <chakra.span color={ textColor } transition="inherit" display="inline-flex">
            { rating }
            <Text variant="secondary" ml={ 1 }>({ count })</Text>
          </chakra.span>
        ) : (
          'Rate it!'
        ) }
      </Button>
    </Tooltip>
  );
};

export default React.forwardRef(TriggerButton);
