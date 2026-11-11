// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';

import type { NavigationPromoBannerConfig } from '../types';

import { Image } from 'src/toolkit/chakra/image';

type Props = {
  banner: Exclude<NavigationPromoBannerConfig, { text: string }>;
  isCollapsed: boolean | undefined;
  isHorizontalNavigation: boolean | undefined;
};

const NavigationPromoBannerImage = ({ banner, isCollapsed, isHorizontalNavigation }: Props) => {
  const isExpanded = isCollapsed === false;

  return (
    <Box
      position="relative"
      minH={ isHorizontalNavigation ? 'auto' : '60px' }
    >
      <Image
        src={ banner.img_url.small }
        alt="Promo banner small"
        boxSize={ isHorizontalNavigation ? '32px' : '60px' }
        borderRadius={ isHorizontalNavigation ? 'sm' : 'base' }
        position={ isHorizontalNavigation ? undefined : 'absolute' }
        top={ isHorizontalNavigation ? undefined : 'calc(50% - 30px)' }
        left={ isHorizontalNavigation ? undefined : 'calc(50% - 30px)' }
        opacity={ isHorizontalNavigation ? 1 : { base: 0, lg: isExpanded ? 0 : 1, xl: isCollapsed ? 1 : 0 } }
        transitionProperty="opacity"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      />
      <Image
        display={ isHorizontalNavigation ? 'none' : 'block' }
        src={ banner.img_url.large }
        alt="Promo banner large"
        w="full"
        maxW={{ base: 'full', lg: '180px' }}
        borderRadius="base"
        aspectRatio={ 2 / 1 }
        opacity={{ base: 1, lg: isExpanded ? 1 : 0, xl: isCollapsed ? 0 : 1 }}
        transitionProperty="opacity"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      />
    </Box>
  );
};

export default NavigationPromoBannerImage;
