import { Tooltip } from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import React from 'react';
import useFontFaceObserver from 'use-font-face-observer';

import { BODY_TYPEFACE } from 'theme/foundations/typography';

interface Props {
  children: React.ReactNode;
  label: string;
}

const TruncatedTextTooltip = ({ children, label }: Props) => {
  const childRef = React.useRef<HTMLElement>(null);
  const [ isTruncated, setTruncated ] = React.useState(false);

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
  };
  const modifiedChildren = React.cloneElement(
    child,
    { ref: childRef },
  );

  if (isTruncated) {
    return <Tooltip label={ label } maxW={{ base: '100vw', lg: '400px' }}>{ modifiedChildren }</Tooltip>;
  }

  return modifiedChildren;
};

export default React.memo(TruncatedTextTooltip);
