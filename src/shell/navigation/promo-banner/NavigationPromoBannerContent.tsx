// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

import NavigationPromoBannerImage from './NavigationPromoBannerImage';
import NavigationPromoBannerText from './NavigationPromoBannerText';

const promoBanner = config.shell.navigation.promoBanner;

type Props = {
  isCollapsed?: boolean;
  isHorizontalNavigation?: boolean;
};

const NavigationPromoBannerContent = ({ isCollapsed, isHorizontalNavigation }: Props) => {
  if (!promoBanner) {
    return null;
  }

  if ('text' in promoBanner) {
    return <NavigationPromoBannerText banner={ promoBanner } isCollapsed={ isCollapsed } isHorizontalNavigation={ isHorizontalNavigation }/>;
  }

  return <NavigationPromoBannerImage banner={ promoBanner } isCollapsed={ isCollapsed } isHorizontalNavigation={ isHorizontalNavigation }/>;
};

export default NavigationPromoBannerContent;
