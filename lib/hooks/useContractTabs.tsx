import React from 'react';

import type { Address } from 'types/api/address';

import ContractCode from 'ui/address/contract/ContractCode';
import ContractRead from 'ui/address/contract/ContractRead';
import ContractWrite from 'ui/address/contract/ContractWrite';

export default function useContractTabs(data: Address | undefined) {
  return React.useMemo(() => {
    return [
      { id: 'contact_code', title: 'Code', component: <ContractCode addressHash={ data?.hash }/> },
      // this is not implemented in api yet
      // data?.has_decompiled_code ?
      //   { id: 'contact_decompiled_code', title: 'Decompiled code', component: <div>Decompiled code</div> } :
      //   undefined,
      data?.has_methods_read ?
        { id: 'read_contract', title: 'Read contract', component: <ContractRead/> } :
        undefined,
      data?.has_methods_read_proxy ?
        { id: 'read_proxy', title: 'Read proxy', component: <ContractRead/> } :
        undefined,
      data?.has_custom_methods_read ?
        { id: 'read_custom_methods', title: 'Read custom', component: <ContractRead/> } :
        undefined,
      data?.has_methods_write ?
        { id: 'write_contract', title: 'Write contract', component: <ContractWrite/> } :
        undefined,
      data?.has_methods_write_proxy ?
        { id: 'write_proxy', title: 'Write proxy', component: <ContractWrite/> } :
        undefined,
      data?.has_custom_methods_write ?
        { id: 'write_custom_methods', title: 'Write custom', component: <ContractWrite/> } :
        undefined,
    ].filter(Boolean);
  }, [ data ]);
}
