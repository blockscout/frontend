// SPDX-License-Identifier: LicenseRef-Blockscout

import NavigationDesktop from 'client/shell/navigation/vertical/NavigationDesktop';

import config from 'configs/app';

const EmptyComponent = () => null;

export default config.UI.navigation.layout === 'horizontal' ? EmptyComponent : NavigationDesktop;
