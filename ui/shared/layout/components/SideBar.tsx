// SPDX-License-Identifier: LicenseRef-Blockscout

import NavigationDesktop from 'client/shell/navigation/components/vertical/NavigationDesktop';

import config from 'configs/app';

const EmptyComponent = () => null;

export default config.UI.navigation.layout === 'horizontal' ? EmptyComponent : NavigationDesktop;
