// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as bens from '@blockscout/bens-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import EnsEntity from 'src/features/name-services/domains/components/EnsEntity';

import dayjs from 'src/shared/date-and-time/dayjs';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';

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
  protocol_dapp_url: protocolDappUrl,
  protocol_dapp_logo: protocolDappLogo,
}: Props) => {

  const protocolDapp = React.useMemo(() => {
    return {
      url: protocolDappUrl,
      logo: protocolDappLogo,
    };
  }, [ protocolDappUrl, protocolDappLogo ]);

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <EnsEntity domain={ name } protocol={ protocol } protocolDapp={ protocolDapp } isLoading={ isLoading } fontWeight={ 600 }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        { resolvedAddress && <AddressEntity address={ resolvedAddress } isLoading={ isLoading } fontWeight={ 500 }/> }
      </TableCell>
      <TableCell verticalAlign="middle" pl={ 9 }>
        <TimeWithTooltip timestamp={ registrationDate } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ expiryDate }
          isLoading={ isLoading }
          color={ expiryDate && dayjs(expiryDate).diff(dayjs(), 'day') < 30 ? 'red.600' : 'inherit' }
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(NameDomainsTableItem);
