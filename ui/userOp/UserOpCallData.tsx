import React from 'react';

import RawInputData from 'ui/shared/RawInputData';

// decoded calldata will be added later
type Props = {
  rawCallData?: string;
}

const UserOpCallData = ({ rawCallData }: Props) => {
  if (!rawCallData) {
    return null;
  }
  return <RawInputData hex={ rawCallData }/>;
};

export default UserOpCallData;
