import { Flex, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenVerifiedInfo as TTokenVerifiedInfo } from 'types/api/token';

import LinkExternal from 'ui/shared/LinkExternal';

interface Props {
  verifiedInfoQuery: UseQueryResult<TTokenVerifiedInfo>;
  isVerifiedInfoEnabled: boolean;
}

const TokenVerifiedInfo = ({ verifiedInfoQuery, isVerifiedInfoEnabled }: Props) => {

  const { data, isLoading, isError } = verifiedInfoQuery;

  const content = (() => {
    if (!isVerifiedInfoEnabled) {
      return <span>explorers</span>;
    }

    if (isLoading) {
      return (
        <>
          <Skeleton w="130px" h="30px" borderRadius="base"/>
          <Skeleton w="130px" h="30px" borderRadius="base"/>
          <Skeleton w="120px" h="30px" borderRadius="base"/>
        </>
      );
    }

    if (isError) {
      return null;
    }

    const websiteLink = (() => {
      try {
        const url = new URL(data.projectWebsite);
        return (
          <LinkExternal href={ data.projectWebsite } px="10px" py="5px" bgColor="gray.100" borderRadius="base">{ url.host }</LinkExternal>
        );
      } catch (error) {
        return null;
      }
    })();

    return (
      <>
        { websiteLink }
        <Skeleton w="130px" h="30px" borderRadius="base"/>
        <Skeleton w="120px" h="30px" borderRadius="base"/>
      </>
    );
  })();

  return <Flex columnGap={ 3 } mt={ 5 }>{ content }</Flex>;
};

export default React.memo(TokenVerifiedInfo);
