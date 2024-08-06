import type { SystemStyleObject } from '@chakra-ui/react';
import { Skeleton, Flex, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import breakpoints from 'theme/foundations/breakpoints';
import colors from 'theme/foundations/colors';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  icon: IconName;
  title: string;
  value: string | React.ReactNode;
  className?: string;
  tooltip?: React.ReactNode;
  url?: string;
  isLoading?: boolean;
}

const LARGEST_BREAKPOINT = '1240px';

const StatsItem = ({ icon, title, value, className, tooltip, url, isLoading }: Props) => {
  const sxContainer: SystemStyleObject = {
    [`@media screen and (min-width: ${ breakpoints.lg }) and (max-width: ${ LARGEST_BREAKPOINT })`]: { flexDirection: 'column' },
  };

  const sxText: SystemStyleObject = {
    [`@media screen and (min-width: ${ breakpoints.lg }) and (max-width: ${ LARGEST_BREAKPOINT })`]: { alignItems: 'center' },
  };

  const bgColor = useColorModeValue('blue.50', 'whiteAlpha.100');
  const loadingBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Flex
      backgroundColor={ isLoading ? loadingBgColor : bgColor }
      padding={ 4 }
      borderRadius="lg"
      flexDirection="row"
      sx={ sxContainer }
      alignItems="center"
      columnGap={ 4 }
      rowGap={ 2 }
      className={ className }
      color={ useColorModeValue('black', colors.grayTrue[200]) }
      position="relative"
      { ...(url && !isLoading ? {
        as: 'a',
        href: url,
      } : {}) }
    >
      <IconSvg name={ icon } boxSize={ 6 } isLoading={ isLoading } borderRadius="base"/>
      <Flex
        flexDirection="column"
        alignItems="start"
        sx={ sxText }
      >
        <Skeleton isLoaded={ !isLoading } color="text_secondary" fontSize="xs" lineHeight="16px" borderRadius="base">
          <span>{ title }</span>
        </Skeleton>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 600 } fontSize="md" color={ useColorModeValue('black', 'white') } borderRadius="base">
          { typeof value === 'string' ? <span>{ value }</span> : value }
        </Skeleton>
      </Flex>
      { tooltip }
    </Flex>
  );
};

export default chakra(StatsItem);
