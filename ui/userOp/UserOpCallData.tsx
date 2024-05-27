import React from 'react';

import type { UserOp } from 'types/api/userOps';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import RawInputData from 'ui/shared/RawInputData';

import UserOpCallDataSwitch from './UserOpCallDataSwitch';

interface Props {
  data: UserOp;
}

const UserOpDecodedCallData = ({ data }: Props) => {

  const [ callData, setCallData ] = React.useState(data.call_data || data.execute_call_data);

  const handleSwitchChange = React.useCallback((isChecked: boolean) => {
    setCallData(isChecked ? data.execute_call_data : data.call_data);
  }, [ data ]);

  if (!callData) {
    return null;
  }

  const toggler = data.execute_call_data ? (
    <UserOpCallDataSwitch
      onChange={ handleSwitchChange }
      initialValue={ !data.call_data }
      isDisabled={ !data.call_data }
      ml={{ base: 3, lg: 'auto' }}
    />
  ) : null;

  return (
    <DetailsInfoItem
      title="Call data"
      hint="Data that’s passed to the sender for execution"
    >
      <RawInputData hex={ callData } rightSlot={ toggler }/>
    </DetailsInfoItem>
  );
};

export default React.memo(UserOpDecodedCallData);
