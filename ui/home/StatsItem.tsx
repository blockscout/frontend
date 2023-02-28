import type { SystemStyleObject, TooltipProps } from '@chakra-ui/react';
import { Flex, Icon, Text, useColorModeValue, chakra, LightMode } from '@chakra-ui/react';
import React from 'react';

import breakpoints from 'theme/foundations/breakpoints';
import Hint from 'ui/shared/Hint';

type Props = {
  icon: React.FC<React.SVGAttributes<SVGElement>>;
  title: string;
  value: string;
  className?: string;
  tooltipLabel?: React.ReactNode;
  url?: string;
}

const LARGEST_BREAKPOINT = '1240px';

const TOOLTIP_PROPS: Partial<TooltipProps> = {
  hasArrow: false,
  borderRadius: 'md',
  placement: 'bottom-end',
  offset: [ 0, 0 ],
  bgColor: 'blackAlpha.900',
};

const StatsItem = ({ icon, title, value, className, tooltipLabel, url }: Props) => {
  const sxContainer: SystemStyleObject = {
    [`@media screen and (min-width: ${ breakpoints.lg }) and (max-width: ${ LARGEST_BREAKPOINT })`]: { flexDirection: 'column' },
  };

  const sxText: SystemStyleObject = {
    [`@media screen and (min-width: ${ breakpoints.lg }) and (max-width: ${ LARGEST_BREAKPOINT })`]: { alignItems: 'center' },
  };

  const infoColor = useColorModeValue('gray.600', 'gray.400');

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
      position="relative"
      { ...(url ? {
        as: 'a',
        href: url,
      } : {}) }
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
      { tooltipLabel && (
        <LightMode>
          <Hint
            label={ tooltipLabel }
            tooltipProps={ TOOLTIP_PROPS }
            boxSize={ 6 }
            color={ infoColor }
            position="absolute"
            top={{ base: 'calc(50% - 12px)', lg: '10px', xl: 'calc(50% - 12px)' }}
            right="10px"
          />
        </LightMode>
      ) }
    </Flex>
  );
};

export default chakra(StatsItem);
