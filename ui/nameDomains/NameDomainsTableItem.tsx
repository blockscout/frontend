import { chakra, Tr, Td, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import dayjs from 'lib/date/dayjs';
import NameDomainExpiryStatus from 'ui/nameDomain/NameDomainExpiryStatus';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';

type Props = bens.Domain & {
  isLoading?: boolean;
};

const NameDomainsTableItem = ({
  isLoading,
  name,
  resolved_address: resolvedAddress,
  registration_date: registrationDate,
  expiry_date: expiryDate,
  protocol,
}: Props) => {

  return (
    <Tr>
      <Td verticalAlign="middle">
        <EnsEntity domain={ name } protocol={ protocol } isLoading={ isLoading } fontWeight={ 600 }/>
      </Td>
      <Td verticalAlign="middle">
        { resolvedAddress && <AddressEntity address={ resolvedAddress } isLoading={ isLoading } fontWeight={ 500 }/> }
      </Td>
      <Td verticalAlign="middle" pl={ 9 }>
        { registrationDate && (
          <Skeleton isLoaded={ !isLoading }>
            { dayjs(registrationDate).format('lll') }
            <chakra.span color="text_secondary"> { dayjs(registrationDate).fromNow() }</chakra.span>
          </Skeleton>
        ) }
      </Td>
      <Td verticalAlign="middle">
        { expiryDate && (
          <Skeleton isLoaded={ !isLoading } whiteSpace="pre-wrap">
            <span>{ dayjs(expiryDate).format('lll') } </span>
            <NameDomainExpiryStatus date={ expiryDate }/>
          </Skeleton>
        ) }
      </Td>
    </Tr>
  );
};

export default React.memo(NameDomainsTableItem);
