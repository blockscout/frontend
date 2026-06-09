// SPDX-License-Identifier: LicenseRef-Blockscout

import NavigationDesktop from 'src/shell/navigation/vertical/NavigationDesktop';

import config from 'src/config';

const EmptyComponent = () => null;

export default config.shell.navigation.layout === 'horizontal' ? EmptyComponent : NavigationDesktop;
