import { HStack, Text, Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';

import useNavLinkStyleProps from './useNavLinkStyleProps';

const promoBanner = config.UI.navigation.promoBanner;

type Props = {
  isCollapsed?: boolean;
  isHorizontalNavigation?: boolean;
};

const NavigationPromoBanner = ({ isCollapsed, isHorizontalNavigation }: Props) => {
  const navLinkStyleProps = useNavLinkStyleProps({ isCollapsed, isExpanded: isCollapsed === false });
  const isMobile = useIsMobile();
  const isXLScreen = useBreakpointValue({ base: false, xl: true });

  const getContent = useCallback((isHorizontalNavigation?: boolean, isCollapsed?: boolean) => {
    if (!promoBanner) {
      return null;
    }

    const isExpanded = isCollapsed === false;

    return 'text' in promoBanner ? (
      <HStack
        { ...navLinkStyleProps.itemProps }
        minW={ isHorizontalNavigation ? 'auto' : 'full' }
        maxW={ isHorizontalNavigation ? 'auto' : 'full' }
        w={ isHorizontalNavigation ? 'auto' : '180px' }
        gap={ 0 }
        overflow="hidden"
        whiteSpace="nowrap"
        py={ isHorizontalNavigation ? 1.5 : '9px' }
        px={ isHorizontalNavigation ? 1.5 : { base: 3, lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 } }
        bgColor={{ _light: promoBanner.bg_color.light, _dark: promoBanner.bg_color.dark }}
        borderRadius="base"
      >
        <Image
          src={ promoBanner.img_url }
          alt="Promo banner icon"
          boxSize={ isHorizontalNavigation ? '20px' : '30px' }
        />
        { !isHorizontalNavigation && (
          <Text
            { ...navLinkStyleProps.textProps }
            fontWeight="medium"
            ml={ 2 }
            color={{ _light: promoBanner.text_color.light, _dark: promoBanner.text_color.dark }}
            opacity={{ base: '1', lg: isExpanded ? '1' : '0', xl: isCollapsed ? '0' : '1' }}
            overflow="hidden"
          >
            { promoBanner.text }
          </Text>
        ) }
      </HStack>
    ) : (
      <Box
        position="relative"
        minH={ isHorizontalNavigation ? 'auto' : '60px' }
        minW={ isHorizontalNavigation ? 'auto' : '60px' }
      >
        <Image
          src={ promoBanner.img_url.small }
          alt="Promo banner small"
          boxSize={ isHorizontalNavigation ? '32px' : '60px' }
          borderRadius={ isHorizontalNavigation ? '4px' : 'base' }
          position={ isHorizontalNavigation ? undefined : 'absolute' }
          top="calc(50% - 30px)"
          left="calc(50% - 30px)"
          opacity={ isHorizontalNavigation ? 1 : { base: 0, lg: isExpanded ? 0 : 1, xl: isCollapsed ? 1 : 0 } }
          transitionProperty="opacity"
          transitionDuration="normal"
          transitionTimingFunction="ease"
        />
        <Image
          display={ isHorizontalNavigation ? 'none' : 'block' }
          src={ promoBanner.img_url.large }
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
  }, [ navLinkStyleProps ]);

  const content = useMemo(() => getContent(isHorizontalNavigation, isCollapsed), [ isHorizontalNavigation, getContent, isCollapsed ]);

  const tooltipContent = useMemo(() => {
    if (isMobile || (!isHorizontalNavigation && (isCollapsed === false || (isCollapsed === undefined && isXLScreen)))) {
      return undefined;
    }
    return getContent(false, false);
  }, [ getContent, isMobile, isHorizontalNavigation, isCollapsed, isXLScreen ]);

  if (!promoBanner) {
    return null;
  }

  return (
    <Flex flex={ 1 } mt={ isHorizontalNavigation ? 0 : 3 } pointerEvents="none">
      <Link
        href={ promoBanner.link_url }
        external
        noIcon
        _hover={{ opacity: 0.8 }}
        mt="auto"
        position={ isHorizontalNavigation ? undefined : 'sticky' }
        bottom={{ base: 0, lg: 6 }}
        pointerEvents="auto"
        py={ 0 }
        w="full"
        overflow="hidden"
      >
        <Tooltip
          content={ tooltipContent }
          showArrow={ false }
          positioning={ isHorizontalNavigation ? undefined : { placement: 'right-end', offset: { crossAxis: 0, mainAxis: 5 } } }
          contentProps={{
            p: 0,
            borderRadius: 'base',
            bgColor: 'transparent',
            boxShadow: isHorizontalNavigation ? `0px 15px 50px ${ 'text' in promoBanner ? '-12px' : '0px' } rgba(0, 0, 0, 0.25)` : undefined,
            cursor: 'default',
          }}
          interactive
          variant="navigation"
        >
          { content }
        </Tooltip>
      </Link>
    </Flex>
  );
};

export default NavigationPromoBanner;
