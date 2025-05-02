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
      closeDelay = 100,
      openDelay = 100,
      interactive,
      ...rest
    } = props;

    const [ open, setOpen ] = React.useState<boolean>(defaultOpen);
    const timeoutRef = React.useRef<number | null>(null);

    const isMobile = useIsMobile();

    const handleClickAway = React.useCallback((event: Event) => {
      if (interactive) {
        const closest = (event.target as HTMLElement)?.closest('.chakra-tooltip__positioner');
        if (closest) {
          return;
        }
      }

      timeoutRef.current = window.setTimeout(() => {
        setOpen(false);
      }, closeDelay);
    }, [ closeDelay, interactive ]);
    const triggerRef = useClickAway<HTMLButtonElement>(handleClickAway);

    const handleOpenChange = React.useCallback((details: { open: boolean }) => {
      setOpen(details.open);
      onOpenChange?.(details);
    }, [ onOpenChange ]);

    const handleTriggerClick = React.useCallback(() => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setOpen((prev) => !prev);
      }, open ? closeDelay : openDelay);
    }, [ open, openDelay, closeDelay ]);

    const handleContentClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    }, []);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

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
        openDelay={ openDelay }
        // FIXME: chakra closes tooltip too fast, so Playwright is not able to make a screenshot of its content
        // so we need to increase the close delay in Playwright environment
        closeDelay={ config.app.isPw ? 10_000 : closeDelay }
        open={ open }
        onOpenChange={ handleOpenChange }
        closeOnClick={ false }
        closeOnPointerDown={ false }
        variant={ variant }
        lazyMount={ lazyMount }
        unmountOnExit={ unmountOnExit }
        interactive={ interactive }
        { ...rest }
        positioning={ positioning }
      >
        <ChakraTooltip.Trigger
          ref={ open ? triggerRef : null }
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
              onClick={ interactive ? handleContentClick : undefined }
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
