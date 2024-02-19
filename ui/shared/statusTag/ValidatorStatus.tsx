import React from 'react';

import type { Validator } from 'types/api/validators';

import StatusTag from './StatusTag';

interface Props {
  state: Validator['state'];
  isLoading?: boolean;
}

const ValidatorStatus = ({ state, isLoading }: Props) => {
  switch (state) {
    case 'active':
      return <StatusTag type="ok" text="Active" isLoading={ isLoading }/>;
    case 'probation':
      return <StatusTag type="pending" text="Probation" isLoading={ isLoading }/>;
    case 'inactive':
      return <StatusTag type="error" text="Failed" isLoading={ isLoading }/>;
  }
};

export default React.memo(ValidatorStatus);
