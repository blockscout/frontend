import React from 'react';

import { MarketplaceCategory } from 'types/client/marketplace';

import config from 'configs/app';
import { apos } from 'lib/html-entities';
import EmptySearchResultDefault from 'ui/shared/EmptySearchResult';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/LinkExternal';

const feature = config.features.marketplace;

type Props = {
  favoriteApps: Array<string>;
  selectedCategoryId?: string;
}

const EmptySearchResult = ({ favoriteApps, selectedCategoryId }: Props) => (
  <EmptySearchResultDefault
    text={
      (selectedCategoryId === MarketplaceCategory.FAVORITES && !favoriteApps.length) ? (
        <>
          You don{ apos }t have any favorite apps.
          Click on the <IconSvg name="star_outline" w={ 4 } h={ 4 } mb={ -0.5 }/> icon on the app{ apos }s card to add it to Favorites.
        </>
      ) : (
        <>
          No matching apps found.
          { 'suggestIdeasFormUrl' in feature && (
            <>
              { ' ' }Have a groundbreaking idea or app suggestion?{ ' ' }
              <LinkExternal href={ feature.suggestIdeasFormUrl }>Share it with us</LinkExternal>
            </>
          ) }
        </>
      )
    }
  />
);

export default React.memo(EmptySearchResult);
