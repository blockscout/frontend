import { Flex, IconButton, chakra } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';
import { ContractListTypes } from 'types/client/marketplace';

import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import AppSecurityReport from '../AppSecurityReport';
import ContractListButton, { ContractListButtonVariants } from '../ContractListButton';
import AppLink from './AppLink';
import MoreInfoButton from './MoreInfoButton';

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
  const { id, securityReport } = app;

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

  const showAnalyzedContracts = React.useCallback(() => {
    showContractList(id, ContractListTypes.ANALYZED);
  }, [ showContractList, id ]);

  return (
    <ListItemMobile
      rowGap={ 3 }
      py={ 3 }
      sx={{
        ':first-child': {
          borderTop: 'none',
          paddingTop: 0,
        },
        ':last-child': {
          borderBottom: 'none',
          paddingBottom: 0,
        },
      }}
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
            { (securityReport || isLoading) ? (
              <>
                <AppSecurityReport
                  isLoading={ isLoading }
                  securityReport={ securityReport }
                  showContractList={ showAnalyzedContracts }
                  height="30px"
                />
                <ContractListButton
                  onClick={ showAllContracts }
                  variant={ ContractListButtonVariants.ALL_CONTRACTS }
                  isLoading={ isLoading }
                >
                  { securityReport?.overallInfo.totalContractsNumber }
                </ContractListButton>
                <ContractListButton
                  onClick={ showVerifiedContracts }
                  variant={ ContractListButtonVariants.VERIFIED_CONTRACTS }
                  isLoading={ isLoading }
                >
                  { securityReport?.overallInfo.verifiedNumber }
                </ContractListButton>
              </>
            ) : (
              <chakra.span fontWeight="500" fontSize="sm">
                Data will be available soon
              </chakra.span>
            ) }
          </Flex>
          <MoreInfoButton onClick={ handleInfoClick } isLoading={ isLoading }/>
        </Flex>
      </Flex>
    </ListItemMobile>
  );
};

export default ListItem;
