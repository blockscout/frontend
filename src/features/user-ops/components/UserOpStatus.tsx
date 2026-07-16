// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import StatusTag from 'src/shared/tags/status-tag/StatusTag';

import type { BadgeProps } from 'src/toolkit/chakra/badge';

interface Props extends BadgeProps {
  status?: boolean;
};

const UserOpStatus = ({ status, ...rest }: Props) => {
  if (status === undefined) {
    return null;
  }

  return (
    <StatusTag type={ status === true ? 'ok' : 'error' } text={ status === true ? 'Success' : 'Failed' } { ...rest }/>
  );
};

export default UserOpStatus;
