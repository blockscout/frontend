/* eslint-disable no-restricted-imports */
import { Popover as ChakraPopover, Portal } from '@chakra-ui/react';
import * as React from 'react';

import { CloseButton } from './close-button';

interface PopoverContentProps extends ChakraPopover.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(function PopoverContent(props, ref) {
  const { portalled = true, portalRef, ...rest } = props;
  return (
    <Portal disabled={ !portalled } container={ portalRef }>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content ref={ ref } { ...rest }/>
      </ChakraPopover.Positioner>
    </Portal>
  );
});

export const PopoverArrow = React.forwardRef<
  HTMLDivElement,
  ChakraPopover.ArrowProps
>(function PopoverArrow(props, ref) {
  return (
    <ChakraPopover.Arrow { ...props } ref={ ref }>
      <ChakraPopover.ArrowTip/>
    </ChakraPopover.Arrow>
  );
});

export const PopoverCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.CloseTriggerProps
>(function PopoverCloseTrigger(props, ref) {
  return (
    <ChakraPopover.CloseTrigger
      position="absolute"
      top="1"
      insetEnd="1"
      { ...props }
      asChild
      ref={ ref }
    >
      <CloseButton/>
    </ChakraPopover.CloseTrigger>
  );
});

export const PopoverRoot = (props: ChakraPopover.RootProps) => {
  const positioning = {
    placement: 'bottom-start' as const,
    ...props.positioning,
    offset: {
      mainAxis: 4,
      ...props.positioning?.offset,
    },
  };

  return (
    <ChakraPopover.Root
      autoFocus={ false }
      { ...props }
      positioning={ positioning }
    />
  );
};

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.TriggerProps
>(function PopoverTrigger(props, ref) {
  return <ChakraPopover.Trigger as="div" display="flex" asChild ref={ ref } { ...props }/>;
});

export const PopoverTitle = ChakraPopover.Title;
export const PopoverDescription = ChakraPopover.Description;
export const PopoverFooter = ChakraPopover.Footer;
export const PopoverHeader = ChakraPopover.Header;
export const PopoverBody = ChakraPopover.Body;
