import { Td, Tr, IconButton, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppWithSecurityReport } from 'types/client/marketplace';
import { ContractListTypes } from 'types/client/marketplace';

import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

import AppSecurityReport from '../AppSecurityReport';
import ContractListButton, { ContractListButtonVariants } from '../ContractListButton';
import AppLink from './AppLink';
import MoreInfoButton from './MoreInfoButton';

type Props = {
  app: MarketplaceAppWithSecurityReport;
  isLoading?: boolean;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'Security view') => void;
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
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'More button', Info: id, Source: 'Security view' });
    onInfoClick(id);
  }, [ onInfoClick, id ]);

  const handleFavoriteClick = React.useCallback(() => {
    onFavoriteClick(id, isFavorite, 'Security view');
  }, [ onFavoriteClick, id, isFavorite ]);

  const showAllContracts = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Total contracts', Info: id, Source: 'Security view' });
    showContractList(id, ContractListTypes.ALL);
  }, [ showContractList, id ]);

  const showVerifiedContracts = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Verified contracts', Info: id, Source: 'Security view' });
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
              id={ id }
              securityReport={ securityReport }
              showContractList={ showAnalyzedContracts }
              isLoading={ isLoading }
              source="Security view"
            />
          </Td>
          <Td verticalAlign="middle">
            <ContractListButton
              onClick={ showAllContracts }
              variant={ ContractListButtonVariants.ALL_CONTRACTS }
              isLoading={ isLoading }
            >
              { securityReport?.overallInfo.totalContractsNumber ?? 0 }
            </ContractListButton>
          </Td>
          <Td verticalAlign="middle">
            <ContractListButton
              onClick={ showVerifiedContracts }
              variant={ ContractListButtonVariants.VERIFIED_CONTRACTS }
              isLoading={ isLoading }
            >
              { securityReport?.overallInfo.verifiedNumber ?? 0 }
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
