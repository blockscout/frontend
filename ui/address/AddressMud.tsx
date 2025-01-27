import { useRouter } from 'next/router';
import React from 'react';

import useIsMounted from 'lib/hooks/useIsMounted';

import AddressMudRecord from './mud/AddressMudRecord';
import AddressMudTable from './mud/AddressMudTable';
import AddressMudTables from './mud/AddressMudTables';

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressMud = ({ scrollRef, shouldRender = true, isQueryEnabled = true }: Props) => {
  const isMounted = useIsMounted();
  const router = useRouter();
  const tableId = router.query.table_id?.toString();
  const recordId = router.query.record_id?.toString();

  if (!isMounted || !shouldRender) {
    return null;
  }

  if (tableId && recordId) {
    return <AddressMudRecord tableId={ tableId } recordId={ recordId } isQueryEnabled={ isQueryEnabled } scrollRef={ scrollRef }/>;
  }

  if (tableId) {
    return <AddressMudTable tableId={ tableId } scrollRef={ scrollRef } isQueryEnabled={ isQueryEnabled }/>;
  }

  return <AddressMudTables scrollRef={ scrollRef } isQueryEnabled={ isQueryEnabled }/>;
};

export default AddressMud;
