// SPDX-License-Identifier: LicenseRef-Blockscout

import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import { useClickAway } from '@uidotdev/usehooks';
import * as React from 'react';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';

import { useLazyActivation } from '../hooks/useLazyActivation';

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

type Activation = 'pointer' | 'focus';

interface TooltipImplProps extends TooltipProps {
  innerRef: React.ForwardedRef<HTMLDivElement>;
  // how the lazily mounted tooltip was activated (see the Tooltip component below);
  // undefined when it is mounted for other reasons (controlled open, non-element children)
  activation?: Activation;
}

const TooltipImpl = (props: TooltipImplProps) => {
  const {
    innerRef,
    activation,
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
  const triggerNodeRef = React.useRef<HTMLButtonElement | null>(null);

  const isMobile = useIsMobile();

  const handleOpenChange = React.useCallback((details: { open: boolean }) => {
    setOpen(details.open);
    onOpenChange?.(details);
  }, [ onOpenChange ]);

  const handleOpenChangeManual = React.useCallback((nextOpen: boolean) => {
    timeoutRef.current && window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setOpen(nextOpen);
      onOpenChange?.({ open: nextOpen });
    }, nextOpen ? openDelay : closeDelay);
  }, [ closeDelay, openDelay, onOpenChange ]);

  const handleClickAway = React.useCallback((event: Event) => {
    if (interactive) {
      const closest = (event.target as HTMLElement)?.closest('.chakra-tooltip__positioner');
      if (closest) {
        return;
      }
    }

    handleOpenChangeManual(false);
  }, [ interactive, handleOpenChangeManual ]);

  const clickAwayRef = useClickAway<HTMLButtonElement>(handleClickAway);

  // the click-away handler must be armed only while the tooltip is open (as before),
  // but the trigger node itself is needed on mount for the activation logic below
  const setTriggerRef = React.useCallback((node: HTMLButtonElement | null) => {
    triggerNodeRef.current = node;
    (clickAwayRef as React.RefObject<HTMLButtonElement | null>).current = open ? node : null;
  }, [ open, clickAwayRef ]);

  const handleTriggerClick = React.useCallback(() => {
    handleOpenChangeManual(!open);
  }, [ handleOpenChangeManual, open ]);

  const handleContentClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // otherwise, the event will be propagated to the trigger
    // and if the trigger is a link, navigation will be triggered
    event.stopPropagation();

    if (interactive) {
      const closestLink = (event.target as HTMLElement)?.closest('a');
      if (closestLink) {
        handleOpenChangeManual(false);
      }
    }
  }, [ interactive, handleOpenChangeManual ]);

  // When mounted lazily, the machine has missed the pointerenter/focus event that
  // activated it, so we open the tooltip manually, respecting openDelay.
  // Two caveats:
  //  - mounting replaces the trigger DOM node, so a focus-activated trigger must be re-focused;
  //  - the pointer (or focus) may have already left by the time the delay elapses — the browser
  //    might not re-dispatch events on the swapped node, so we re-check :hover / activeElement
  //    instead of relying on events, otherwise the tooltip would open and get stuck.
  React.useEffect(() => {
    if (!activation) {
      return;
    }

    if (activation === 'focus') {
      triggerNodeRef.current?.focus({ preventScroll: true });
    }

    const timeoutId = window.setTimeout(() => {
      const node = triggerNodeRef.current;
      if (!node) {
        return;
      }
      const isStillActive = activation === 'pointer' ? node.matches(':hover') : node.contains(document.activeElement);
      if (isStillActive) {
        setOpen(true);
        onOpenChange?.({ open: true });
      }
    }, openDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  // run on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        ref={ setTriggerRef }
        asChild
        onClick={ isMobile ? handleTriggerClick : undefined }
        { ...triggerProps }
      >
        { children }
      </ChakraTooltip.Trigger>
      <Portal disabled={ !portalled } container={ portalRef }>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content
            ref={ innerRef }
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
};

// Mounting ChakraTooltip.Root is expensive: every instance creates a zag.js state machine
// plus several context providers, which dominates the render time of pages with many
// tooltips (a table row easily holds a dozen of them, all closed). So until the first
// pointer/focus interaction we render only the bare trigger element with activation
// handlers (gesture-safe, see useLazyActivation), and mount the real tooltip on demand.
//
// Trade-offs of the on-demand mount (handled in TooltipImpl):
//  - the trigger DOM node is unmounted and remounted once upon activation;
//  - the machine misses the activating event, so the first open is driven manually.
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const { activation, handlers } = useLazyActivation();

    // controlled or default-open tooltips cannot defer mounting
    const isOpenExternally = Boolean(props.open ?? props.defaultOpen);

    if (props.disabled) {
      return props.children;
    }

    if (activation === null && !isOpenExternally && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<Record<string, unknown>>;

      const withOriginal = (handlerName: keyof typeof handlers) => (event: never) => {
        const originalHandler = child.props[handlerName];
        if (typeof originalHandler === 'function') {
          originalHandler(event);
        }
        handlers[handlerName](event);
      };

      return React.cloneElement(child, {
        onPointerEnter: withOriginal('onPointerEnter'),
        onPointerDown: withOriginal('onPointerDown'),
        onPointerUp: withOriginal('onPointerUp'),
        onPointerCancel: withOriginal('onPointerCancel'),
        onFocus: withOriginal('onFocus'),
        onClick: withOriginal('onClick'),
      });
    }

    return <TooltipImpl { ...props } innerRef={ ref } activation={ activation?.type }/>;
  },
);
