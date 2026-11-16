// SPDX-License-Identifier: LicenseRef-Blockscout

import { type ButtonProps } from '@chakra-ui/react';

import UserProfileAuth0 from 'src/features/account/components/user-profile/auth0/UserProfileDesktop';
import UserWalletDesktop from 'src/features/account/components/user-profile/wallet/UserWalletDesktop';

import config from 'src/config';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const UserProfileDesktop = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  if (config.features.account.isEnabled) {
    return <UserProfileAuth0 buttonSize={ buttonSize } buttonVariant={ buttonVariant }/>;
  }
  if (config.features.connectWallet.isEnabled) {
    return <UserWalletDesktop buttonSize={ buttonSize } buttonVariant={ buttonVariant }/>;
  }
  return null;
};

export default UserProfileDesktop;
