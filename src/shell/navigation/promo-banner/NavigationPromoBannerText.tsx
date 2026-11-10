// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, Text } from '@chakra-ui/react';

import type { NavigationPromoBannerConfig } from '../types';

import { Image } from 'src/toolkit/chakra/image';

import useNavLinkStyleProps from '../useNavLinkStyleProps';

type Props = {
  banner: Extract<NavigationPromoBannerConfig, { text: string }>;
  isCollapsed?: boolean;
  isHorizontalNavigation?: boolean;
};

const NavigationPromoBannerText = ({ banner, isCollapsed, isHorizontalNavigation }: Props) => {
  const isExpanded = isCollapsed === false;
  const navLinkStyleProps = useNavLinkStyleProps({ isCollapsed, isExpanded });

  return (
    <HStack
      { ...navLinkStyleProps.itemProps }
      minW={ isHorizontalNavigation ? 'auto' : 'full' }
      maxW={ isHorizontalNavigation ? 'auto' : 'full' }
      w={ isHorizontalNavigation ? 'auto' : '180px' }
      gap={ 2 }
      overflow="hidden"
      whiteSpace="nowrap"
      py={ isHorizontalNavigation ? 1.5 : 2 }
      px={ isHorizontalNavigation ? 1.5 : { base: 3, lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 } }
      bgColor={{ _light: banner.bg_color.light, _dark: banner.bg_color.dark }}
    >
      <Image
        src={ banner.img_url }
        alt="Promo banner icon"
        boxSize={ isHorizontalNavigation ? '20px' : '30px' }
      />
      { !isHorizontalNavigation && (
        <Text
          { ...navLinkStyleProps.textProps }
          fontWeight="medium"
          color={{ _light: banner.text_color.light, _dark: banner.text_color.dark }}
          overflow="hidden"
        >
          { banner.text }
        </Text>
      ) }
    </HStack>
  );
};

export default NavigationPromoBannerText;
