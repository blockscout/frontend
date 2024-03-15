import { Hide, Show } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppWithSecurityReport, ContractListTypes } from 'types/client/marketplace';
import { MarketplaceCategory } from 'types/client/marketplace';

import { apos } from 'lib/html-entities';
import DataListDisplay from 'ui/shared/DataListDisplay';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import IconSvg from 'ui/shared/IconSvg';

import ListItem from './MarketplaceListWithScores/ListItem';
import Table from './MarketplaceListWithScores/Table';

interface Props {
  apps: Array<MarketplaceAppWithSecurityReport>;
  showAppInfo: (id: string) => void;
  favoriteApps: Array<string>;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
  selectedCategoryId?: string;
  onAppClick: (event: MouseEvent, id: string) => void;
  showContractList: (id: string, type: ContractListTypes) => void;
}

const MarketplaceListWithScores = ({
  apps,
  showAppInfo,
  favoriteApps,
  onFavoriteClick,
  isLoading,
  selectedCategoryId,
  onAppClick,
  showContractList,
}: Props) => {

  const displayedApps = React.useMemo(() =>
    apps
      .filter((app) => app.securityReport)
      .sort((a, b) => b.securityReport.overallInfo.securityScore - a.securityReport.overallInfo.securityScore)
  , [ apps ]);

  const content = apps.length > 0 ? (
    <>
      <Show below="lg" ssr={ false }>
        { displayedApps.map((app, index) => (
          <ListItem
            key={ app.id + (isLoading ? index : '') }
            app={ app }
            onInfoClick={ showAppInfo }
            isFavorite={ favoriteApps.includes(app.id) }
            onFavoriteClick={ onFavoriteClick }
            isLoading={ isLoading }
            onAppClick={ onAppClick }
            showContractList={ showContractList }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <Table
          apps={ displayedApps }
          isLoading={ isLoading }
          onAppClick={ onAppClick }
          favoriteApps={ favoriteApps }
          onFavoriteClick={ onFavoriteClick }
          onInfoClick={ showAppInfo }
          showContractList={ showContractList }
        />
      </Hide>
    </>
  ) : null;

  return apps.length > 0 ? (
    <DataListDisplay
      isError={ false }
      items={ apps }
      emptyText="No apps found."
      content={ content }
    />
  ) : (
    <EmptySearchResult
      text={
        (selectedCategoryId === MarketplaceCategory.FAVORITES && !favoriteApps.length) ? (
          <>
            You don{ apos }t have any favorite apps.
            Click on the <IconSvg name="star_outline" w={ 4 } h={ 4 } mb={ -0.5 }/> icon on the app{ apos }s card to add it to Favorites.
          </>
        ) : (
          `Couldn${ apos }t find an app that matches your filter query.`
        )
      }
    />
  );
};

export default MarketplaceListWithScores;