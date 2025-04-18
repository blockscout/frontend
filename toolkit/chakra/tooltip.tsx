import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import { useClickAway } from '@uidotdev/usehooks';
import * as React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';

export interface TooltipProps extends ChakraTooltip.RootProps {
  selected?: boolean;
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  triggerProps?: ChakraTooltip.TriggerProps;
  disabled?: boolean;
  disableOnMobile?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow: showArrowProp,
      onOpenChange,
      variant,
      selected,
      children,
      disabled,
      disableOnMobile,
      portalled = true,
      content,
      contentProps,
      portalRef,
      defaultOpen = false,
      lazyMount = true,
      unmountOnExit = true,
      triggerProps,
      closeDelay,
      ...rest
    } = props;

    const [ open, setOpen ] = React.useState<boolean>(defaultOpen);

    const isMobile = useIsMobile();
    const triggerRef = useClickAway<HTMLButtonElement>(() => setOpen(false));

    const handleOpenChange = React.useCallback((details: { open: boolean }) => {
      setOpen(details.open);
      onOpenChange?.(details);
    }, [ onOpenChange ]);

    const handleTriggerClick = React.useCallback(() => {
      setOpen((prev) => !prev);
    }, [ ]);

    if (disabled || (disableOnMobile && isMobile)) return children;

    const defaultShowArrow = variant === 'popover' ? false : true;
    const showArrow = showArrowProp !== undefined ? showArrowProp : defaultShowArrow;

    const positioning = {
      ...rest.positioning,
      overflowPadding: 4,
      offset: {
        mainAxis: 4,
        ...rest.positioning?.offset,
      },
    };

    return (
      <ChakraTooltip.Root
        openDelay={ 100 }
        // FIXME: chakra closes tooltip too fast, so Playwright is not able to make a screenshot of its content
        // so we need to increase the close delay in Playwright environment
        closeDelay={ config.app.isPw ? 10_000 : closeDelay ?? 100 }
        open={ open }
        onOpenChange={ handleOpenChange }
        closeOnClick={ false }
        closeOnPointerDown={ true }
        variant={ variant }
        lazyMount={ lazyMount }
        unmountOnExit={ unmountOnExit }
        { ...rest }
        positioning={ positioning }
      >
        <ChakraTooltip.Trigger
          ref={ triggerRef }
          asChild
          onClick={ isMobile ? handleTriggerClick : undefined }
          { ...triggerProps }
        >
          { children }
        </ChakraTooltip.Trigger>
        <Portal disabled={ !portalled } container={ portalRef }>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content
              ref={ ref }
              { ...(selected ? { 'data-selected': true } : {}) }
              { ...contentProps }
            >
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
