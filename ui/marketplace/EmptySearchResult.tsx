import React from 'react';

import { MarketplaceCategory } from 'types/client/marketplace';

import config from 'configs/app';
import { apos } from 'lib/html-entities';
import EmptySearchResultDefault from 'ui/shared/EmptySearchResult';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';

const feature = config.features.marketplace;

type Props = {
  favoriteApps: Array<string>;
  selectedCategoryId?: string;
};

const EmptySearchResult = ({ favoriteApps, selectedCategoryId }: Props) => (
  <EmptySearchResultDefault
    text={
      (selectedCategoryId === MarketplaceCategory.FAVORITES && !favoriteApps.length) ? (
        <>
          You don{ apos }t have any favorite apps.<br/>
          Click on the <IconSvg name="heart_outline" boxSize={ 5 } mb={ -1 } color="gray.400"/> icon on the app{ apos }s card to add it to Favorites.
        </>
      ) : (
        <>
          No matching apps found.
          { 'suggestIdeasFormUrl' in feature && (
            <>
              { ' ' }Have a groundbreaking idea or app suggestion?<br/>
              <LinkExternal href={ feature.suggestIdeasFormUrl }>Share it with us</LinkExternal>
            </>
          ) }
        </>
      )
    }
  />
);

export default React.memo(EmptySearchResult);
