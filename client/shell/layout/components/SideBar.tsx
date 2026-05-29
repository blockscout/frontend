// SPDX-License-Identifier: LicenseRef-Blockscout

import NavigationDesktop from 'client/shell/navigation/vertical/NavigationDesktop';

import config from 'client/config';

const EmptyComponent = () => null;

export default config.shell.navigation.layout === 'horizontal' ? EmptyComponent : NavigationDesktop;
