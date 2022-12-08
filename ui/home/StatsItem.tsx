import { Flex, Icon, Text, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import breakpoints from 'theme/foundations/breakpoints';

type Props = {
  icon: React.FC<React.SVGAttributes<SVGElement>>;
  title: string;
  value: string;
  className?: string;
}

const LARGEST_BREAKPOINT = '1240px';

const StatsItem = ({ icon, title, value, className }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sxContainer = {} as any;
  sxContainer[`@media screen and (min-width: ${ breakpoints.lg }) and (max-width: ${ LARGEST_BREAKPOINT })`] = { flexDirection: 'column' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sxText = {} as any;
  sxText[`@media screen and (min-width: ${ breakpoints.lg }) and (max-width: ${ LARGEST_BREAKPOINT })`] = { alignItems: 'center' };

  return (
    <Flex
      backgroundColor={ useColorModeValue('blue.50', 'blue.800') }
      padding={ 3 }
      borderRadius="md"
      flexDirection="row"
      sx={ sxContainer }
      alignItems="center"
      columnGap={ 3 }
      rowGap={ 2 }
      className={ className }
      color={ useColorModeValue('black', 'white') }
    >
      <Icon as={ icon } boxSize={ 7 }/>
      <Flex
        flexDirection="column"
        alignItems="start"
        sx={ sxText }
      >
        <Text variant="secondary" fontSize="xs" lineHeight="16px">{ title }</Text>
        <Text fontWeight={ 500 } fontSize="md" color={ useColorModeValue('black', 'white') }>{ value }</Text>
      </Flex>
    </Flex>
  );
};

export default chakra(StatsItem);
