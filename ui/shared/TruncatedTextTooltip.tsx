import React from 'react';
import { Tooltip } from '@chakra-ui/react'
import debounce from 'lodash/debounce';

interface Props {
  children: React.ReactNode;
  label: string;
}

const TruncatedTextTooltip = ({ children, label }: Props) => {
  const childRef = React.useRef<HTMLElement>(null);
  const [ isTruncated, setTruncated ] = React.useState(false);

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

  React.useLayoutEffect(() => {
    updatedTruncateState()
  }, [ updatedTruncateState ]);

  React.useEffect(() => {
    const handleResize = debounce(updatedTruncateState, 1000)
    window.addEventListener('resize', handleResize)

    return function cleanup() {
      window.removeEventListener('resize', handleResize)
    };
  }, [ updatedTruncateState ]);

  // as for now it supports only one child
  // it is not cleared how to manage case with two or more children
  const child = React.Children.only(children) as React.ReactElement & {
    ref?: React.Ref<React.ReactNode>;
  }
  const modifiedChildren = React.cloneElement(
    child,
    { ref: childRef },
  );

  if (isTruncated) {
    return <Tooltip label={ label }>{ modifiedChildren }</Tooltip>;
  }

  return modifiedChildren;
};

export default React.memo(TruncatedTextTooltip);
