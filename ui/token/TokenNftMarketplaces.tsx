import { Image, Link, Skeleton, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

import config from 'configs/app';
import ActionButton from 'ui/shared/ActionButton/ActionButton';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TextSeparator from 'ui/shared/TextSeparator';

interface Props {
  hash: string | undefined;
  id?: string;
  isLoading?: boolean;
  actionData?: AddressMetadataTagFormatted['meta'];
  source: 'NFT collection' | 'NFT item';
  isExperiment?: boolean;
}

const TokenNftMarketplaces = ({ hash, id, isLoading, actionData, source, isExperiment }: Props) => {
  if (!hash || config.UI.views.nft.marketplaces.length === 0) {
    return null;
  }

  return (
    <DetailsInfoItem
      title="Marketplaces"
      hint="Marketplaces trading this NFT"
      alignSelf="center"
      isLoading={ isLoading }
      py={ (actionData && isExperiment) ? 1 : 2 }
    >
      <Skeleton isLoaded={ !isLoading } display="flex" columnGap={ 3 } flexWrap="wrap" alignItems="center">
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
        { (actionData && isExperiment) && (
          <>
            <TextSeparator color="gray.500" margin={ 0 }/>
            <ActionButton data={ actionData } height="30px" source={ source }/>
          </>
        ) }
      </Skeleton>
    </DetailsInfoItem>
  );
};

export default React.memo(TokenNftMarketplaces);
