import { Flex, chakra, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenVerifiedInfo as TTokenVerifiedInfo } from 'types/api/token';

import config from 'configs/app';
import LinkExternal from 'ui/shared/LinkExternal';

import TokenProjectInfo from './TokenProjectInfo';

interface Props {
  className?: string;
  verifiedInfoQuery: UseQueryResult<TTokenVerifiedInfo>;
}

const TokenVerifiedInfo = ({ verifiedInfoQuery, className }: Props) => {

  const { data, isLoading, isError } = verifiedInfoQuery;
  const websiteLinkBg = useColorModeValue('gray.100', 'gray.700');

  const content = (() => {
    if (!config.features.verifiedTokens.isEnabled) {
      return null;
    }

    if (isLoading) {
      return null;
    }

    if (isError) {
      return null;
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
        <TokenProjectInfo data={ data }/>
      </>
    );
  })();

  return (
    <Flex className={ className } columnGap={ 2 } rowGap={ 2 } _empty={{ display: 'none' }}>
      { content }
    </Flex>
  );
};

export default React.memo(chakra(TokenVerifiedInfo));
