import type { Placement } from '@floating-ui/dom';
import { debounce } from 'es-toolkit';
import React from 'react';
import useFontFaceObserver from 'use-font-face-observer';

import { Tooltip } from 'toolkit/chakra/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { BODY_TYPEFACE } from 'toolkit/theme/foundations/typography';

interface Props {
  children: React.ReactNode;
  label: React.ReactNode;
  placement?: Placement;
}

const TruncatedTextTooltip = ({ children, label, placement }: Props) => {
  const childRef = React.useRef<HTMLElement>(null);
  const [ isTruncated, setTruncated ] = React.useState(false);
  const { open, onToggle, onOpen, onClose } = useDisclosure();

  const isFontFaceLoaded = useFontFaceObserver([
    { family: BODY_TYPEFACE },
  ]);

  const updatedTruncateState = React.useCallback(() => {
    if (childRef.current) {
      const scrollWidth = childRef.current.scrollWidth;
      const clientWidth = childRef.current.clientWidth;

      if (scrollWidth > clientWidth) {
        setTruncated(true);
      } else {
        setTruncated(false);
      }
    }
  }, []);

  // FIXME: that should be useLayoutEffect, but it keeps complaining about SSR
  // let's keep it as it is until the first issue
  React.useEffect(() => {
    updatedTruncateState();
  }, [ updatedTruncateState, isFontFaceLoaded ]);

  // we want to do recalculation when isFontFaceLoaded flag is changed
  // but we don't want to create more resize event listeners
  // that's why there are separate useEffect hooks
  React.useEffect(() => {
    const handleResize = debounce(updatedTruncateState, 1000);
    window.addEventListener('resize', handleResize);

    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  }, [ updatedTruncateState ]);

  // as for now it supports only one child
  // and it is not cleared how to manage case with two or more children
  const child = React.Children.only(children) as React.ReactElement & {
    ref?: React.Ref<React.ReactNode>;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  };
  const handleClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onToggle();
  }, [ onToggle ]);

  const modifiedChildren = React.cloneElement(
    child,
    {
      ref: childRef,
      onClick: handleClick,
      onMouseEnter: onOpen,
      onMouseLeave: onClose,
    },
  );

  if (isTruncated) {
    return (
      <Tooltip
        content={ label }
        contentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '400px' } }}
        positioning={{ placement }}
        open={ open }
      >
        { modifiedChildren }
      </Tooltip>
    );
  }

  return modifiedChildren;
};

export default React.memo(TruncatedTextTooltip);
