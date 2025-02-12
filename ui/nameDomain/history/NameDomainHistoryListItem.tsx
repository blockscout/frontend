import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import stripTrailingSlash from 'lib/stripTrailingSlash';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

interface Props {
  event: bens.DomainEvent;
  domain: bens.DetailedDomain | undefined;
  isLoading?: boolean;
}

const NameDomainHistoryListItem = ({ isLoading, domain, event }: Props) => {
  const isProtocolBaseChain = stripTrailingSlash(domain?.protocol?.deployment_blockscout_base_url ?? '') === config.app.baseUrl;
  const txEntityProps = {
    isExternal: !isProtocolBaseChain ? true : false,
    href: !isProtocolBaseChain ? (
      stripTrailingSlash(domain?.protocol?.deployment_blockscout_base_url ?? '') +
      route({ pathname: '/tx/[hash]', query: { hash: event.transaction_hash } })
    ) : undefined,
  };

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity { ...txEntityProps } hash={ event.transaction_hash } isLoading={ isLoading } fontWeight={ 500 } truncation="constant_long"/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeAgoWithTooltip
          timestamp={ event.timestamp }
          isLoading={ isLoading }
          color="text_secondary"
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      { event.from_address && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity address={ event.from_address } isLoading={ isLoading } truncation="constant"/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { event.action && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Method</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Tag colorScheme="gray" isLoading={ isLoading }>{ event.action }</Tag>
          </ListItemMobileGrid.Value>
        </>
      ) }
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(NameDomainHistoryListItem);
