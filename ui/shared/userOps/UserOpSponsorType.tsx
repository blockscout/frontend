import { Tag } from '@chakra-ui/react';
import React from 'react';

import type { UserOpSponsorType as TUserOpSponsorType } from 'types/api/userOps';

type Props = {
  sponsorType: TUserOpSponsorType;
}

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
  return <Tag>{ text }</Tag>;
};

export default UserOpSponsorType;
