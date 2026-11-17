// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  hash: string | undefined;
  id?: string;
  isLoading?: boolean;
}

const TokenNftMarketplaces = ({ hash, id, isLoading }: Props) => {
  if (!hash || config.slices.token.nft.marketplaces.length === 0) {
    return null;
  }

  const items = config.slices.token.nft.marketplaces
    .map((item) => {
      const hrefTemplate = id ? item.instance_url : item.collection_url;
      if (!hrefTemplate) {
        return null;
      }
      const href = hrefTemplate
        .replace('{id}', id || '')
        .replace('{id_lowercase}', id?.toLowerCase() || '')
        .replace('{hash}', hash || '')
        .replace('{hash_lowercase}', hash?.toLowerCase() || '');

      return {
        href,
        logo_url: item.logo_url,
        name: item.name,
      };
    })
    .filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Marketplaces trading this NFT"
        isLoading={ isLoading }
      >
        Marketplaces
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue py="6px">
        <Skeleton loading={ isLoading } display="flex" flexWrap="wrap" alignItems="center">
          <HStack gap={ 3 }>
            { items.map((item) => {
              return (
                <Tooltip content={ `View on ${ item.name }` } key={ item.name }>
                  <Link href={ item.href } external noIcon>
                    <Image
                      src={ item.logo_url }
                      alt={ `${ item.name } marketplace logo` }
                      boxSize={ 5 }
                      borderRadius="full"
                    />
                  </Link>
                </Tooltip>
              );
            }) }
          </HStack>
        </Skeleton>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TokenNftMarketplaces);
