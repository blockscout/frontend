import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import { Link } from '../../../chakra/link';
import { Skeleton } from '../../../chakra/skeleton';

export interface ChartWidgetRootProps extends FlexProps {}

export const ChartWidgetRoot = React.forwardRef<HTMLDivElement, ChartWidgetRootProps>(({ children, ...rest }, ref) => {
  return (
    <Flex
      height="100%"
      ref={ ref }
      flexDir="column"
      padding={{ base: 3, lg: 4 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
      { ...rest }
    >
      { children }
    </Flex>
  );
});

export interface ChartWidgetHeaderProps extends FlexProps {
  title: string;
  description?: string;
  href?: string;
  isLoading?: boolean;
}

export const ChartWidgetHeader = ({ title, description, href, isLoading, ...rest }: ChartWidgetHeaderProps) => {

  const content = (
    <Flex
      flexGrow={ 1 }
      flexDir="column"
      alignItems="flex-start"
      cursor={ href ? 'pointer' : 'default' }
      _hover={ href ? { color: 'link.primary.hovered' } : {} }
      { ...rest }
    >
      <Skeleton
        loading={ isLoading }
        fontWeight={ 600 }
        textStyle="md"
      >
        <span>{ title }</span>
      </Skeleton>
      { description && (
        <Skeleton
          loading={ isLoading }
          color="text.secondary"
          textStyle="xs"
          mt={ 1 }
        >
          <span>{ description }</span>
        </Skeleton>
      ) }
    </Flex>
  );

  if (href) {
    return <Link href={ href }>{ content }</Link>;
  }

  return content;
};
