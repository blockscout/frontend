import _clamp from 'lodash/clamp';
import React from 'react';
import { useInView } from 'react-intersection-observer';

const STEP = 10;
const MIN_ITEMS_NUM = 50;

export default function useLazyRenderedList(list: Array<unknown>, isEnabled: boolean) {
  const [ renderedItemsNum, setRenderedItemsNum ] = React.useState(MIN_ITEMS_NUM);
  const { ref, inView } = useInView({
    rootMargin: '200px',
    triggerOnce: false,
    skip: !isEnabled || list.length <= MIN_ITEMS_NUM,
  });

  React.useEffect(() => {
    if (inView) {
      setRenderedItemsNum((prev) => _clamp(prev + STEP, 0, list.length));
    }
  }, [ inView, list.length ]);

  return { cutRef: ref, renderedItemsNum };
}
