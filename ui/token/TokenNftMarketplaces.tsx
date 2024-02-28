import { Image, Link, Skeleton, Tooltip } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  hash: string | undefined;
  id?: string;
  isLoading?: boolean;
}

const TokenNftMarketplaces = ({ hash, id, isLoading }: Props) => {
  if (!hash || config.UI.views.nft.marketplaces.length === 0) {
    return null;
  }

  return (
    <DetailsInfoItem
      title="Marketplaces"
      hint="Marketplaces trading this NFT"
      alignSelf="center"
      isLoading={ isLoading }
    >
      <Skeleton isLoaded={ !isLoading } display="flex" columnGap={ 3 } flexWrap="wrap">
        { config.UI.views.nft.marketplaces.map((item) => {

          const hrefTemplate = id ? item.instance_url : item.collection_url;
          const href = hrefTemplate.replace('{id}', id || '').replace('{hash}', hash || '');

          return (
            <Tooltip label={ `View on ${ item.name }` } key={ item.name }>
              <Link href={ href } target="_blank">
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
      </Skeleton>
    </DetailsInfoItem>
  );
};

export default React.memo(TokenNftMarketplaces);
