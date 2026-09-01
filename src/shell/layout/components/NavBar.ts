// SPDX-License-Identifier: LicenseRef-Blockscout

import NavigationDesktop from 'src/shell/navigation/horizontal/NavigationDesktop';

import config from 'src/config';

const EmptyComponent = () => null;

export default config.shell.navigation.layout === 'horizontal' ? NavigationDesktop : EmptyComponent;
