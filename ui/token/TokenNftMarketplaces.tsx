import React from 'react';

import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

import config from 'configs/app';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import AppActionButton from 'ui/shared/AppActionButton/AppActionButton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TextSeparator from 'ui/shared/TextSeparator';

interface Props {
  hash: string | undefined;
  id?: string;
  isLoading?: boolean;
  appActionData?: AddressMetadataTagFormatted['meta'];
  source: 'NFT collection' | 'NFT item';
}

const TokenNftMarketplaces = ({ hash, id, isLoading, appActionData, source }: Props) => {
  if (!hash || config.UI.views.nft.marketplaces.length === 0) {
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
      <DetailedInfo.ItemValue
        py={ appActionData ? '1px' : '6px' }
      >
        <Skeleton loading={ isLoading } display="flex" columnGap={ 3 } flexWrap="wrap" alignItems="center">
          { config.UI.views.nft.marketplaces.map((item) => {

            const hrefTemplate = id ? item.instance_url : item.collection_url;
            const href = hrefTemplate.replace('{id}', id || '').replace('{hash}', hash || '');

            return (
              <Tooltip content={ `View on ${ item.name }` } key={ item.name }>
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
          { appActionData && (
            <>
              <TextSeparator color="gray.500" margin={ 0 }/>
              <AppActionButton data={ appActionData } height="30px" source={ source }/>
            </>
          ) }
        </Skeleton>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TokenNftMarketplaces);
