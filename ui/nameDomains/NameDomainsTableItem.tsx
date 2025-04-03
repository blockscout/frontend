import { chakra } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
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
    <TableRow>
      <TableCell verticalAlign="middle">
        <EnsEntity domain={ name } protocol={ protocol } isLoading={ isLoading } fontWeight={ 600 }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        { resolvedAddress && <AddressEntity address={ resolvedAddress } isLoading={ isLoading } fontWeight={ 500 }/> }
      </TableCell>
      <TableCell verticalAlign="middle" pl={ 9 }>
        { registrationDate && (
          <Skeleton loading={ isLoading }>
            { dayjs(registrationDate).format('lll') }
            <chakra.span color="text.secondary"> { dayjs(registrationDate).fromNow() }</chakra.span>
          </Skeleton>
        ) }
      </TableCell>
      <TableCell verticalAlign="middle">
        { expiryDate && (
          <Skeleton loading={ isLoading }>
            <span>{ dayjs(expiryDate).format('lll') } </span>
            <NameDomainExpiryStatus date={ expiryDate }/>
          </Skeleton>
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(NameDomainsTableItem);
