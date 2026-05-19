// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { UserOpSponsorType as TUserOpSponsorType } from 'client/features/user-ops/types/api';

import { Badge } from 'toolkit/chakra/badge';

type Props = {
  sponsorType: TUserOpSponsorType;
};

const UserOpSponsorType = ({ sponsorType }: Props) => {
  let text: string = sponsorType;
  switch (sponsorType) {
    case 'paymaster_hybrid':
      text = 'Paymaster hybrid';
      break;
    case 'paymaster_sponsor':
      text = 'Paymaster sponsor';
      break;
    case 'wallet_balance':
      text = 'Wallet balance';
      break;
    case 'wallet_deposit':
      text = 'Wallet deposit';
  }
  return <Badge>{ text }</Badge>;
};

export default UserOpSponsorType;
