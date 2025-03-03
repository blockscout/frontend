import { Flex, type FlexProps } from '@chakra-ui/react';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import useUpdateEffect from 'lib/hooks/useUpdateEffect';

import type { ButtonProps } from './button';
import { Button } from './button';

interface CollapsibleDetailsProps extends ButtonProps {
  children: React.ReactNode;
  id?: string;
  isExpanded?: boolean;
  text?: [string, string];
}

export const CollapsibleDetails = (props: CollapsibleDetailsProps) => {
  const CUT_ID = 'CollapsibleDetails';

  const { children, id = CUT_ID, onClick, isExpanded: isExpandedProp = false, text: textProp, loading, ...rest } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(isExpandedProp);

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo(id, {
      duration: 500,
      smooth: true,
    });
    onClick?.(event);
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
      <Button
        variant="link"
        textStyle="sm"
        textDecorationLine="underline"
        textDecorationStyle="dashed"
        w="fit-content"
        onClick={ handleClick }
        loadingSkeleton={ loading }
        { ...rest }
      >
        <Element name={ id }>{ text }</Element>
      </Button>
      { isExpanded && children }
    </>
  );
};

interface CollapsibleListProps<T> extends FlexProps {
  items: Array<T>;
  renderItem: (item: T, index: number) => React.ReactNode;
  triggerProps?: ButtonProps;
  cutLength?: number;
}

export const CollapsibleList = <T,>(props: CollapsibleListProps<T>) => {
  const CUT_LENGTH = 3;

  const { items, renderItem, triggerProps, cutLength = CUT_LENGTH, ...rest } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleToggle = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
  }, []);

  return (
    <Flex flexDir="column" w="100%" { ...rest }>
      { items.slice(0, isExpanded ? undefined : cutLength).map(renderItem) }
      { items.length > cutLength && (
        <Button
          variant="link"
          textStyle="sm"
          textDecorationLine="underline"
          textDecorationStyle="dashed"
          w="fit-content"
          minW="auto"
          onClick={ handleToggle }
          { ...triggerProps }
        >
          { isExpanded ? 'Hide' : 'Show all' }
        </Button>
      ) }
    </Flex>
  );
};
