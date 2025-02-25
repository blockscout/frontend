import React from 'react';
import { scroller, Element } from 'react-scroll';

import useUpdateEffect from 'lib/hooks/useUpdateEffect';
import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';

interface Props extends LinkProps {
  children: React.ReactNode;
  id?: string;
  onClick?: () => void;
  isExpanded?: boolean;
  text?: [string, string];
}

const ID = 'CutLink';

const CutLink = (props: Props) => {
  const { children, id = ID, onClick, isExpanded: isExpandedProp = false, text: textProp, ...rest } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(isExpandedProp);

  const handleClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo(id, {
      duration: 500,
      smooth: true,
    });
    onClick?.();
  }, [ id, onClick ]);

  useUpdateEffect(() => {
    setIsExpanded(isExpandedProp);
    isExpandedProp && scroller.scrollTo(id, {
      duration: 500,
      smooth: true,
    });
  }, [ isExpandedProp, id ]);

  const text = isExpanded ? (textProp?.[1] ?? 'Hide details') : (textProp?.[0] ?? 'View details');

  return (
    <>
      <Link
        textStyle="sm"
        textDecorationLine="underline"
        textDecorationStyle="dashed"
        w="fit-content"
        onClick={ handleClick }
        asChild
        { ...rest }
      >
        <Element name={ id }>{ text }</Element>
      </Link>
      { isExpanded && children }
    </>
  );
};

export default React.memo(CutLink);
