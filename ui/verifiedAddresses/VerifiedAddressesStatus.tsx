import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfoApplication } from 'types/api/account';

import colors from 'theme/foundations/colors';

interface Props {
  status?: TokenInfoApplication['status'];
}

const VerifiedAddressesStatus = ({ status }: Props) => {
  switch (status) {
    case 'IN_PROCESS': {
      return <chakra.span fontWeight={ 500 }>In progress</chakra.span>;
    }
    case 'APPROVED': {
      return <chakra.span fontWeight={ 500 } color={ colors.success[500] }>Approved</chakra.span>;
    }
    case 'UPDATE_REQUIRED': {
      return <chakra.span fontWeight={ 500 } color={ colors.orangeDark[500] }>Waiting for update</chakra.span>; //orange
    }
    case 'REJECTED': {
      return <chakra.span fontWeight={ 500 } color={ colors.error[500] }>Rejected</chakra.span>;
    }

    default:
      return null;
  }
};

export default VerifiedAddressesStatus;
