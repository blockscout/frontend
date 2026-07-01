// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type * as contractsInfo from '@blockscout/contracts-info-types';

import type { ResourceError } from 'src/api/resources';

import config from 'src/config';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TokenProjectInfo from './TokenProjectInfo';

interface Props {
  verifiedInfoQuery: UseQueryResult<contractsInfo.TokenInfo, ResourceError<unknown>>;
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
