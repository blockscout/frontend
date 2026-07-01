// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import * as adminRs from '@blockscout/admin-rs-types';

interface Props {
  status?: adminRs.TokenInfoSubmissionStatus;
}

const VerifiedAddressesStatus = ({ status }: Props) => {
  switch (status) {
    case adminRs.TokenInfoSubmissionStatus.IN_PROCESS: {
      return <chakra.span fontWeight={ 500 }>In progress</chakra.span>;
    }
    case adminRs.TokenInfoSubmissionStatus.APPROVED: {
      return <chakra.span fontWeight={ 500 } color="green.500">Approved</chakra.span>;
    }
    case adminRs.TokenInfoSubmissionStatus.UPDATE_REQUIRED: {
      return <chakra.span fontWeight={ 500 } color="orange.500">Waiting for update</chakra.span>;
    }
    case adminRs.TokenInfoSubmissionStatus.REJECTED: {
      return <chakra.span fontWeight={ 500 } color="red.500">Rejected</chakra.span>;
    }

    default:
      return null;
  }
};

export default VerifiedAddressesStatus;
