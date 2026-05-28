// SPDX-License-Identifier: LicenseRef-Blockscout

import NavigationDesktop from 'client/shell/navigation/horizontal/NavigationDesktop';

import config from 'client/config';

const EmptyComponent = () => null;

export default config.shell.navigation.layout === 'horizontal' ? NavigationDesktop : EmptyComponent;
