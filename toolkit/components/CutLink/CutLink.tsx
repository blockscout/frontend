import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';

interface Props extends LinkProps {
  children: React.ReactNode;
  id?: string;
  onClick?: () => void;
}

const ID = 'CutLink';

const CutLink = (props: Props) => {
  const { children, id = ID, onClick, ...rest } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo(id, {
      duration: 500,
      smooth: true,
    });
    onClick?.();
  }, [ id, onClick ]);

  const text = isExpanded ? 'Hide details' : 'View details';

  return (
    <>
      <Link
        textStyle="sm"
        textDecorationLine="underline"
        textDecorationStyle="dashed"
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
