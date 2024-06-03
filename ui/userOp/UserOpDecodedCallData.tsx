import React from 'react';

import type { UserOp } from 'types/api/userOps';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';

import UserOpCallDataSwitch from './UserOpCallDataSwitch';

interface Props {
  data: UserOp;
}

const UserOpDecodedCallData = ({ data }: Props) => {

  const [ callData, setCallData ] = React.useState(data.decoded_execute_call_data || data.decoded_call_data);

  const handleSwitchChange = React.useCallback((isChecked: boolean) => {
    setCallData(isChecked ? data.decoded_call_data : data.decoded_execute_call_data);
  }, [ data ]);

  if (!callData) {
    return null;
  }

  const toggler = data.decoded_call_data ? (
    <UserOpCallDataSwitch
      onChange={ handleSwitchChange }
      initialValue={ !data.decoded_execute_call_data }
      isDisabled={ !data.decoded_execute_call_data }
      ml={{ base: 0, lg: 'auto' }}
    />
  ) : null;

  return (
    <>
      <DetailsInfoItem.Label
        hint="Decoded call data"
      >
        Decoded call data
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexDir={{ base: 'column', lg: 'row' }}
        alignItems={{ base: 'flex-start', lg: 'center' }}
      >
        <LogDecodedInputData data={ callData } rightSlot={ toggler }/>
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(UserOpDecodedCallData);
