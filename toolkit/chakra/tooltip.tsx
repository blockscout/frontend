import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import { useClickAway } from '@uidotdev/usehooks';
import * as React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow = true,
      children,
      disabled,
      portalled,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props;

    const [ open, setOpen ] = React.useState(false);

    const isMobile = useIsMobile();
    const triggerRef = useClickAway<HTMLButtonElement>(() => setOpen(false));

    const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
      setOpen(open);
    }, []);

    const handleTriggerClick = React.useCallback(() => {
      // FIXME on mobile tooltip will open and close simultaneously
      setOpen((prev) => !prev);
    }, [ ]);

    if (disabled) return children;

    const positioning = {
      ...rest.positioning,
      offset: {
        mainAxis: 4,
        ...rest.positioning?.offset,
      },
    };

    return (
      <ChakraTooltip.Root
        openDelay={ 100 }
        closeDelay={ 100 }
        open={ open }
        onOpenChange={ handleOpenChange }
        { ...rest }
        positioning={ positioning }
        closeOnClick={ false }
      >
        <ChakraTooltip.Trigger
          ref={ triggerRef }
          asChild
          onClick={ isMobile ? handleTriggerClick : undefined }
        >
          { children }
        </ChakraTooltip.Trigger>
        <Portal disabled={ !portalled } container={ portalRef }>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ ref } p={ 2 } { ...contentProps }>
              { showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip/>
                </ChakraTooltip.Arrow>
              ) }
              { content }
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  },
);
