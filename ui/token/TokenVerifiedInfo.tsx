import { Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenVerifiedInfo as TTokenVerifiedInfo } from 'types/api/token';

import LinkExternal from 'ui/shared/LinkExternal';
import NetworkExplorers from 'ui/shared/NetworkExplorers';

import TokenProjectInfo from './TokenProjectInfo';

interface Props {
  verifiedInfoQuery: UseQueryResult<TTokenVerifiedInfo>;
  isVerifiedInfoEnabled: boolean;
  hash: string;
}

const TokenVerifiedInfo = ({ verifiedInfoQuery, isVerifiedInfoEnabled, hash }: Props) => {

  const { data, isLoading, isError } = verifiedInfoQuery;
  const websiteLinkBg = useColorModeValue('gray.100', 'gray.700');

  const content = (() => {
    const explorers = <NetworkExplorers type="token" pathParam={ hash }/>;

    if (!isVerifiedInfoEnabled) {
      return explorers;
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
      return explorers;
    }

    const websiteLink = (() => {
      try {
        const url = new URL(data.projectWebsite);
        return (
          <LinkExternal href={ data.projectWebsite } px="10px" py="5px" bgColor={ websiteLinkBg } borderRadius="base">{ url.host }</LinkExternal>
        );
      } catch (error) {
        return null;
      }
    })();

    return (
      <>
        { websiteLink }
        { Boolean(data.tokenAddress) && <TokenProjectInfo data={ data }/> }
        { explorers }
      </>
    );
  })();

  return <Flex columnGap={ 3 } rowGap={ 3 } mt={ 5 } flexWrap="wrap" _empty={{ display: 'none' }}>{ content }</Flex>;
};

export default React.memo(TokenVerifiedInfo);
