import type { SystemStyleObject } from '@chakra-ui/react';
import { Skeleton, Flex, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import breakpoints from 'theme/foundations/breakpoints';
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

  const bgColor = useColorModeValue('rgba(255, 255, 255, 1)', 'rgba(47, 47, 47, 1)');
  const loadingBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Flex
      backgroundColor={ isLoading ? loadingBgColor : bgColor }
      borderColor={ useColorModeValue('rgba(230, 230, 231, 1)', 'rgba(66, 66, 68, 1)') }
      padding={ 3 }
      borderRadius="md"
      borderWidth="1px"
      borderStyle="solid"
      flexDirection="row"
      sx={ sxContainer }
      alignItems="center"
      columnGap={ 3 }
      rowGap={ 2 }
      className={ className }
      color={ useColorModeValue('black', 'white') }
      position="relative"
      boxShadow="0px 4px 6px -2px rgba(17, 17, 17, 0.06)"
      { ...(url && !isLoading ? {
        as: 'a',
        href: url,
      } : {}) }
    >
      <IconSvg name={ icon } boxSize={ 7 } isLoading={ isLoading } borderRadius="base"/>
      <Flex
        flexDirection="column"
        alignItems="start"
        sx={ sxText }
      >
        <Skeleton isLoaded={ !isLoading } color="text_secondary" fontSize="xs" lineHeight="16px" borderRadius="base">
          <span>{ title }</span>
        </Skeleton>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 } fontSize="md" color={ useColorModeValue('black', 'white') } borderRadius="base">
          { typeof value === 'string' ? <span>{ value }</span> : value }
        </Skeleton>
      </Flex>
      { tooltip }
    </Flex>
  );
};

export default chakra(StatsItem);
