// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useIsMounted from 'client/shared/hooks/useIsMounted';

import AddressMudRecord from './AddressMudRecord';
import AddressMudTable from './AddressMudTable';
import AddressMudTables from './AddressMudTables';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressMud = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const isMounted = useIsMounted();
  const router = useRouter();
  const tableId = router.query.table_id?.toString();
  const recordId = router.query.record_id?.toString();

  if (!isMounted || !shouldRender) {
    return null;
  }

  if (tableId && recordId) {
    return <AddressMudRecord tableId={ tableId } recordId={ recordId } isQueryEnabled={ isQueryEnabled }/>;
  }

  if (tableId) {
    return <AddressMudTable tableId={ tableId } isQueryEnabled={ isQueryEnabled }/>;
  }

  return <AddressMudTables isQueryEnabled={ isQueryEnabled }/>;
};

export default AddressMud;
