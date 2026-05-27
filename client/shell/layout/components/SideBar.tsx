// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';

import NavigationDesktop from 'client/shell/navigation/vertical/NavigationDesktop';

const EmptyComponent = () => null;

export default config.UI.navigation.layout === 'horizontal' ? EmptyComponent : NavigationDesktop;
