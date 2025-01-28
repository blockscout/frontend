import React from 'react';
import { scroller, Element } from 'react-scroll';

import { Link } from 'toolkit/chakra/link';

interface Props {
  children: React.ReactNode;
  id?: string;
  onClick?: () => void;
  isLoading?: boolean;

}

const ID = 'CutLink';

const CutLink = (props: Props) => {
  const { children, id = ID, onClick, isLoading } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo(id, {
      duration: 500,
      smooth: true,
    });
    onClick?.();
  }, [ id, onClick ]);

  return (
    <>
      <Element name={ id }>
        <Link
          textStyle="sm"
          textDecorationLine="underline"
          textDecorationStyle="dashed"
          onClick={ handleClick }
          loading={ isLoading }
        >
          { isExpanded ? 'Hide details' : 'View details' }
        </Link>
      </Element>
      { isExpanded && children }
    </>
  );
};

export default React.memo(CutLink);
