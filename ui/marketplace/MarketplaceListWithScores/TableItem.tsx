import { Td, Tr, IconButton } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

import AppLink from './AppLink';
import AppSecurityReport from './AppSecurityReport';
import LinkButton from './LinkButton';

type Props = {
  app: MarketplaceAppPreview & { securityReport?: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  isLoading?: boolean;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  onAppClick: (event: MouseEvent, id: string) => void;
  onInfoClick: (id: string) => void;
}

const TableItem = ({
  app,
  isLoading,
  isFavorite,
  onFavoriteClick,
  onAppClick,
  onInfoClick,
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
        <AppSecurityReport securityReport={ securityReport } isLarge/>
      </Td>
      <Td verticalAlign="middle">
        <LinkButton onClick={ handleInfoClick } icon="contracts">{ totalContractsNumber }</LinkButton>
      </Td>
      <Td verticalAlign="middle">
        <LinkButton onClick={ handleInfoClick } icon="contracts_verified" iconColor="green.500">{ verifiedNumber }</LinkButton>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <LinkButton onClick={ handleInfoClick }>More info</LinkButton>
      </Td>
    </Tr>
  );
};

export default TableItem;
