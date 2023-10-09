import { Flex, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenVerifiedInfo as TTokenVerifiedInfo } from 'types/api/token';

import config from 'configs/app';
import LinkExternal from 'ui/shared/LinkExternal';

import TokenProjectInfo from './TokenProjectInfo';

interface Props {
  verifiedInfoQuery: UseQueryResult<TTokenVerifiedInfo>;
}

const TokenVerifiedInfo = ({ verifiedInfoQuery }: Props) => {

  const { data, isLoading, isError } = verifiedInfoQuery;

  const content = (() => {
    if (!config.features.verifiedTokens.isEnabled) {
      return null;
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
          <LinkExternal href={ data.projectWebsite } variant="subtle">{ url.host }</LinkExternal>
        );
      } catch (error) {
        return null;
      }
    })();

    return (
      <>
        { websiteLink }
        <TokenProjectInfo data={ data }/>
      </>
    );
  })();

  return <Flex columnGap={ 3 } rowGap={ 3 } mt={ 5 } flexWrap="wrap" _empty={{ display: 'none' }}>{ content }</Flex>;
};

export default React.memo(TokenVerifiedInfo);
