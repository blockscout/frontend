import React from 'react';

import type { UserOp } from 'types/api/userOps';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import RawInputData from 'ui/shared/RawInputData';

import UserOpCallDataSwitch from './UserOpCallDataSwitch';

interface Props {
  data: UserOp;
}

const UserOpDecodedCallData = ({ data }: Props) => {

  const [ callData, setCallData ] = React.useState<string | null>(data.execute_call_data || data.call_data);

  const handleSwitchChange = React.useCallback((isChecked: boolean) => {
    setCallData(isChecked ? data.call_data : data.execute_call_data);
  }, [ data ]);

  if (!callData) {
    return null;
  }

  const toggler = data.call_data ? (
    <UserOpCallDataSwitch
      onChange={ handleSwitchChange }
      initialValue={ !data.execute_call_data }
      isDisabled={ !data.execute_call_data }
      ml={{ base: 3, lg: 'auto' }}
    />
  ) : null;

  return (
    <>
      <DetailsInfoItem.Label
        hint="Data that’s passed to the sender for execution"
      >
        Call data
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <RawInputData hex={ callData } rightSlot={ toggler }/>
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(UserOpDecodedCallData);
