import { Td, Tr, IconButton, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';
import { ContractListTypes } from 'types/client/marketplace';

import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

import AppSecurityReport from '../AppSecurityReport';
import ContractListButton, { ContractListButtonVariants } from '../ContractListButton';
import AppLink from './AppLink';
import MoreInfoButton from './MoreInfoButton';

type Props = {
  app: MarketplaceAppPreview & { securityReport?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  isLoading?: boolean;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  onAppClick: (event: MouseEvent, id: string) => void;
  onInfoClick: (id: string) => void;
  showContractList: (id: string, type: ContractListTypes) => void;
}

const TableItem = ({
  app,
  isLoading,
  isFavorite,
  onFavoriteClick,
  onAppClick,
  onInfoClick,
  showContractList,
}: Props) => {

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
    <Tr>
      <Td verticalAlign="middle" px={ 2 }>
        <Skeleton isLoaded={ !isLoading }>
          <IconButton
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
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <AppLink app={ app } isLoading={ isLoading } onAppClick={ onAppClick } isLarge/>
      </Td>
      { (securityReport || isLoading) ? (
        <>
          <Td verticalAlign="middle">
            <AppSecurityReport
              securityReport={ securityReport }
              showContractList={ showAnalyzedContracts }
              isLoading={ isLoading }
            />
          </Td>
          <Td verticalAlign="middle">
            <ContractListButton
              onClick={ showAllContracts }
              variant={ ContractListButtonVariants.ALL_CONTRACTS }
              isLoading={ isLoading }
            >
              { securityReport?.overallInfo.totalContractsNumber }
            </ContractListButton>
          </Td>
          <Td verticalAlign="middle">
            <ContractListButton
              onClick={ showVerifiedContracts }
              variant={ ContractListButtonVariants.VERIFIED_CONTRACTS }
              isLoading={ isLoading }
            >
              { securityReport?.overallInfo.verifiedNumber }
            </ContractListButton>
          </Td>
        </>
      ) : (
        <Td verticalAlign="middle" colSpan={ 3 }>
          <Text variant="secondary" fontSize="sm" fontWeight={ 500 }>Data will be available soon</Text>
        </Td>
      ) }
      <Td verticalAlign="middle" isNumeric>
        <MoreInfoButton onClick={ handleInfoClick } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
};

export default TableItem;
