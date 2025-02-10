import { Flex, type FlexProps } from '@chakra-ui/react';
import React from 'react';

import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';

interface Props<T> extends FlexProps {
  items: Array<T>;
  renderItem: (item: T, index: number) => React.ReactNode;
  linkProps?: LinkProps;
  cutLength?: number;
}

const CUT_LENGTH = 3;

const CutLinkList = <T,>(props: Props<T>) => {
  const { items, renderItem, linkProps, cutLength = CUT_LENGTH, ...rest } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleToggle = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
  }, []);

  return (
    <Flex flexDir="column" w="100%" { ...rest }>
      { items.slice(0, isExpanded ? undefined : cutLength).map(renderItem) }
      { items.length > cutLength && (
        <Link
          textStyle="sm"
          textDecorationLine="underline"
          textDecorationStyle="dashed"
          w="fit-content"
          onClick={ handleToggle }
          { ...linkProps }
        >
          { isExpanded ? 'Hide' : 'Show all' }
        </Link>
      ) }
    </Flex>
  );
};

export default React.memo(CutLinkList) as typeof CutLinkList;
