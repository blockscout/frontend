import { Box, Flex, Icon, Text, useColorModeValue, chakra, Tooltip, LightMode } from '@chakra-ui/react';
import React from 'react';

import infoIcon from 'icons/info.svg';
import breakpoints from 'theme/foundations/breakpoints';

type Props = {
  icon: React.FC<React.SVGAttributes<SVGElement>>;
  title: string;
  value: string;
  className?: string;
  tooltipLabel?: React.ReactNode;
}

const LARGEST_BREAKPOINT = '1240px';

const StatsItem = ({ icon, title, value, className, tooltipLabel }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sxContainer = {} as any;
  sxContainer[`@media screen and (min-width: ${ breakpoints.lg }) and (max-width: ${ LARGEST_BREAKPOINT })`] = { flexDirection: 'column' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sxText = {} as any;
  sxText[`@media screen and (min-width: ${ breakpoints.lg }) and (max-width: ${ LARGEST_BREAKPOINT })`] = { alignItems: 'center' };

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
          <Tooltip label={ tooltipLabel } hasArrow={ false } borderRadius="12px" placement="bottom-end" offset={ [ 0, 0 ] } bgColor="blackAlpha.900">
            <Box
              position="absolute"
              top={{ base: 'calc(50% - 12px)', lg: '10px', xl: 'calc(50% - 12px)' }}
              right="10px">
              <Icon
                as={ infoIcon }
                boxSize={ 6 }
                color={ infoColor }
              />
            </Box>
          </Tooltip>
        </LightMode>
      ) }
    </Flex>
  );
};

export default chakra(StatsItem);
