import { Flex, LinkBox, IconButton } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import AppLink from './AppLink';
import LinkButton from './LinkButton';

interface Props {
  app: MarketplaceAppPreview;
  onInfoClick: (id: string) => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
}

const ListItem = ({ app, onInfoClick, isFavorite, onFavoriteClick, isLoading, onAppClick }: Props) => {
  const { id } = app;

  const handleInfoClick = React.useCallback((event: MouseEvent) => {
    event.preventDefault();
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'More button', Info: id });
    onInfoClick(id);
  }, [ onInfoClick, id ]);

  const handleFavoriteClick = React.useCallback(() => {
    onFavoriteClick(id, isFavorite);
  }, [ onFavoriteClick, id, isFavorite ]);

  return (
    <ListItemMobile
      rowGap={ 3 }
      py={ 3 }
      sx={{ ':first-child': { borderTop: 'none' }, ':last-child': { borderBottom: 'none' } }}
    >
      <LinkBox height="100%" width="100%" role="group">
        <Flex
          direction="column"
          justifyContent="stretch"
          padding={ 3 }
        >
          <AppLink app={ app } isLoading={ isLoading } onAppClick={ onAppClick }/>
          <Flex>
            <Flex flex={ 1 } gap={ 3 }>
              <LinkButton onClick={ handleInfoClick } icon="contracts">13</LinkButton>
              <LinkButton onClick={ handleInfoClick } icon="contracts_verified" iconColor="green.500">13</LinkButton>
            </Flex>
            { !isLoading && (
              <LinkButton onClick={ handleInfoClick }>More info</LinkButton>
            ) }
          </Flex>

          { !isLoading && (
            <IconButton
              position="absolute"
              right={ 0 }
              top={ 0 }
              aria-label="Mark as favorite"
              title="Mark as favorite"
              variant="ghost"
              colorScheme="gray"
              w={ 9 }
              h={ 8 }
              onClick={ handleFavoriteClick }
              icon={ isFavorite ?
                <IconSvg name="star_filled" w={ 4 } h={ 4 } color="yellow.400"/> :
                <IconSvg name="star_outline" w={ 4 } h={ 4 } color="gray.300"/>
              }
            />
          ) }
        </Flex>
      </LinkBox>
    </ListItemMobile>
  );
};

export default ListItem;
