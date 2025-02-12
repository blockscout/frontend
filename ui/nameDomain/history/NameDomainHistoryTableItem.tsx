import { Tr, Td } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import stripTrailingSlash from 'lib/stripTrailingSlash';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

interface Props {
  event: bens.DomainEvent;
  domain: bens.DetailedDomain | undefined;
  isLoading?: boolean;
}

const NameDomainHistoryTableItem = ({ isLoading, event, domain }: Props) => {
  const isProtocolBaseChain = stripTrailingSlash(domain?.protocol?.deployment_blockscout_base_url ?? '') === config.app.baseUrl;
  const txEntityProps = {
    isExternal: !isProtocolBaseChain ? true : false,
    href: !isProtocolBaseChain ? (
      stripTrailingSlash(domain?.protocol?.deployment_blockscout_base_url ?? '') +
      route({ pathname: '/tx/[hash]', query: { hash: event.transaction_hash } })
    ) : undefined,
  };

  return (
    <Tr>
      <Td verticalAlign="middle">
        <TxEntity
          { ...txEntityProps }
          hash={ event.transaction_hash }
          isLoading={ isLoading }
          fontWeight={ 700 }
          noIcon
          truncation="constant_long"
        />
      </Td>
      <Td pl={ 9 } verticalAlign="middle">
        <TimeAgoWithTooltip
          timestamp={ event.timestamp }
          isLoading={ isLoading }
          color="text_secondary"
          display="inline-block"
        />
      </Td>
      <Td verticalAlign="middle">
        { event.from_address && <AddressEntity address={ event.from_address } isLoading={ isLoading } truncation="constant"/> }
      </Td>
      <Td verticalAlign="middle">
        { event.action && <Tag colorScheme="gray" isLoading={ isLoading }>{ event.action }</Tag> }
      </Td>
    </Tr>
  );
};

export default React.memo(NameDomainHistoryTableItem);
