import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';
import { ContractListTypes } from 'types/client/marketplace';

import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import AppLink from './AppLink';
import AppSecurityReport from './AppSecurityReport';
import LinkButton, { LinkButtonVariants } from './LinkButton';

type Props = {
  app: MarketplaceAppPreview & { securityReport?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  onInfoClick: (id: string) => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
  showContractList: (id: string, type: ContractListTypes) => void;
}

const ListItem = ({ app, onInfoClick, isFavorite, onFavoriteClick, isLoading, onAppClick, showContractList }: Props) => {
  const {
    id,
    securityReport,
    securityReport: {
      overallInfo: {
        verifiedNumber,
        totalContractsNumber,
      },
    },
  } = app;

  const handleInfoClick = React.useCallback((event: MouseEvent) => {
    event.preventDefault();
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'More button', Info: id });
    onInfoClick(id);
  }, [ onInfoClick, id ]);

  const handleFavoriteClick = React.useCallback(() => {
    onFavoriteClick(id, isFavorite);
  }, [ onFavoriteClick, id, isFavorite ]);

  const showAllContracts = React.useCallback(() => {
    showContractList(id, ContractListTypes.ALL);
  }, [ showContractList, id ]);

  const showVerifiedContracts = React.useCallback(() => {
    showContractList(id, ContractListTypes.VERIFIED);
  }, [ showContractList, id ]);

  return (
    <ListItemMobile
      rowGap={ 3 }
      py={ 3 }
      sx={{ ':first-child': { borderTop: 'none' }, ':last-child': { borderBottom: 'none' } }}
    >
      <Flex
        direction="column"
        justifyContent="stretch"
        padding={ 3 }
        width="100%"
      >
        <Flex position="relative">
          <AppLink app={ app } isLoading={ isLoading } onAppClick={ onAppClick }/>
          { !isLoading && (
            <IconButton
              position="absolute"
              right={ -1 }
              top={ -1 }
              aria-label="Mark as favorite"
              title="Mark as favorite"
              variant="ghost"
              colorScheme="gray"
              w={ 9 }
              h={ 8 }
              onClick={ handleFavoriteClick }
              icon={ isFavorite ?
                <IconSvg name="star_filled" w={ 5 } h={ 5 } color="yellow.400"/> :
                <IconSvg name="star_outline" w={ 5 } h={ 5 } color="gray.400"/>
              }
            />
          ) }
        </Flex>
        <Flex alignItems="center">
          <Flex flex={ 1 } gap={ 3 } alignItems="center">
            <AppSecurityReport id={ id } securityReport={ securityReport } showContractList={ showContractList }/>
            <LinkButton onClick={ showAllContracts } variant={ LinkButtonVariants.ALL_CONTRACTS }>{ totalContractsNumber }</LinkButton>
            <LinkButton onClick={ showVerifiedContracts } variant={ LinkButtonVariants.VERIFIED_CONTRACTS }>{ verifiedNumber }</LinkButton>
          </Flex>
          { !isLoading && (
            <LinkButton onClick={ handleInfoClick }>More info</LinkButton>
          ) }
        </Flex>
      </Flex>
    </ListItemMobile>
  );
};

export default ListItem;
