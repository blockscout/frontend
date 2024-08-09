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

  const toggler = data.decoded_call_data && data.decoded_execute_call_data ? (
    <UserOpCallDataSwitch
      onChange={ handleSwitchChange }
      initialValue={ false }
      ml={{ base: 0, lg: 'auto' }}
    />
  ) : null;

  const labelText = data.call_data && !data.execute_call_data ? 'Decoded external call data' : 'Decoded call data';

  return (
    <>
      <DetailsInfoItem.Label
        hint={ labelText }
      >
        { labelText }
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
