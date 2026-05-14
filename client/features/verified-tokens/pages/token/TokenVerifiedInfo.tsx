// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenVerifiedInfo as TTokenVerifiedInfo } from 'client/features/verified-tokens/types/api';

import type { ResourceError } from 'client/api/resources';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';

import TokenProjectInfo from './TokenProjectInfo';

interface Props {
  verifiedInfoQuery: UseQueryResult<TTokenVerifiedInfo, ResourceError<unknown>>;
}

const TokenVerifiedInfo = ({ verifiedInfoQuery }: Props) => {

  const { data, isPending, isError } = verifiedInfoQuery;

  const content = (() => {
    if (!config.features.verifiedTokens.isEnabled) {
      return null;
    }

    if (isPending) {
      return (
        <>
          <Skeleton loading w="100px" h="30px" borderRadius="base"/>
          <Skeleton loading w="100px" h="30px" borderRadius="base"/>
          <Skeleton loading w="70px" h="30px" borderRadius="base"/>
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
          <Link external href={ data.projectWebsite } variant="underlaid" flexShrink={ 0 } textStyle="sm">
            { url.host }
          </Link>
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

  return content;
};

export default React.memo(TokenVerifiedInfo);
