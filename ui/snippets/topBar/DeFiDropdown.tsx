import { Button, Box, Menu, MenuButton, MenuList, MenuItem, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import getPageType from 'lib/mixpanel/getPageType';
import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

const feature = config.features.deFi;

function getHrefAndTarget(feature: { url: string } | { dappId: string }) {
  return 'url' in feature ? {
    href: feature.url,
    target: '_blank',
  } : {
    href: route({ pathname: '/apps/[id]', query: { id: feature.dappId, action: 'connect' } }),
    target: '_self',
  };
}

const DeFiDropdown = () => {
  const router = useRouter();
  const source = getPageType(router.pathname);
  const isMobile = useIsMobile();

  const handleClick = React.useCallback((content: 'Swap button' | 'Payment link') => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: content, Source: source });
  }, [ source ]);

  const items = React.useMemo(() => {
    if (!feature.isEnabled) {
      return [];
    }

    const items = [];

    if (feature.swapButton) {
      const { href, target } = getHrefAndTarget(feature.swapButton);
      items.push({
        icon: 'swap' as const,
        text: 'Swap',
        href,
        target,
        onClick: () => handleClick('Swap button'),
      });
    }

    if (feature.paymentLink) {
      const { href, target } = getHrefAndTarget(feature.paymentLink);
      items.push({
        icon: 'payment_link' as const,
        text: 'Payment link',
        href,
        target,
        onClick: () => handleClick('Payment link'),
      });
    }

    return items;
  }, [ handleClick ]);

  if (items.length === 0) {
    return null;
  }

  const buttonStyles = {
    variant: 'solid',
    size: 'xs',
    borderRadius: 'sm',
    height: 5,
    px: 1.5,
    fontWeight: '500',
  };

  return items.length > 1 ? (
    <Menu>
      <MenuButton as={ Button } { ...buttonStyles }>
        <Flex alignItems="center">
          { !isMobile && 'Blockscout' } DeFi
          <IconSvg name="arrows/south-mini" boxSize={ 4 } ml={ 1 }/>
        </Flex>
      </MenuButton>
      <MenuList minWidth="160px" zIndex="popover" overflow="hidden" py={ 4 }>
        { items.map((item, index) => (
          <MenuItem
            key={ index }
            as="a"
            href={ item.href }
            target={ item.target }
            onClick={ item.onClick }
            height="48px"
            px={ 4 }
            fontSize="sm"
            fontWeight="500"
          >
            <IconSvg name={ item.icon } boxSize={ 5 } mr={ 3 }/>
            <span>{ item.text }</span>
          </MenuItem>
        )) }
      </MenuList>
    </Menu>
  ) : (
    <Button
      as="a"
      href={ items[0].href }
      target={ items[0].target }
      onClick={ items[0].onClick }
      { ...buttonStyles }
    >
      <IconSvg name={ items[0].icon } boxSize={ 3 } mr={{ base: 0, sm: 1 }}/>
      <Box display={{ base: 'none', sm: 'inline' }}>
        { items[0].text }
      </Box>
    </Button>
  );
};

export default React.memo(DeFiDropdown);
