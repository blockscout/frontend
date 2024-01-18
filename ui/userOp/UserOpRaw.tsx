import { Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { pick } from 'lodash';
import React from 'react';

import type { UserOp } from 'types/api/userOps';

import type { ResourceError } from 'lib/api/resources';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

interface Props {
  query: UseQueryResult<UserOp, ResourceError>;
}

const RAW_FIELDS: Array<keyof UserOp> = [
  'sender',
  'nonce',
  'init_code',
  'call_data',
  'call_gas_limit',
  'verification_gas_limit',
  'pre_verification_gas',
  'max_fee_per_gas',
  'max_priority_fee_per_gas',
  'paymaster_and_data',
  'signature',
];

const UserOpRaw = ({ query }: Props) => {
  if (!query.data) {
    return null;
  }
  const dataToDisplay = pick(query.data, RAW_FIELDS);

  const text = JSON.stringify(dataToDisplay, undefined, 4);

  return <Skeleton isLoaded={ !query.isPlaceholderData }><RawDataSnippet data={ text }/></Skeleton>;
};

export default UserOpRaw;
