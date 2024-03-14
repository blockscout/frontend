import { Td, Tr, IconButton } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';
import { ContractListTypes } from 'types/client/marketplace';

import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

import AppLink from './AppLink';
import AppSecurityReport from './AppSecurityReport';
import LinkButton, { LinkButtonVariants } from './LinkButton';
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
    <Tr>
      <Td verticalAlign="middle" px={ 2 }>
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
      </Td>
      <Td verticalAlign="middle">
        <AppLink app={ app } isLoading={ isLoading } onAppClick={ onAppClick } isLarge/>
      </Td>
      <Td verticalAlign="middle">
        <AppSecurityReport id={ id } securityReport={ securityReport } showContractList={ showContractList } isLarge/>
      </Td>
      <Td verticalAlign="middle">
        <LinkButton onClick={ showAllContracts } variant={ LinkButtonVariants.ALL_CONTRACTS }>
          { totalContractsNumber }
        </LinkButton>
      </Td>
      <Td verticalAlign="middle">
        <LinkButton onClick={ showVerifiedContracts } variant={ LinkButtonVariants.VERIFIED_CONTRACTS }>{ verifiedNumber }</LinkButton>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <MoreInfoButton onClick={ handleInfoClick }/>
      </Td>
    </Tr>
  );
};

export default TableItem;
