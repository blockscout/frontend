import { Button, Box, Flex, Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import getPageType from 'lib/mixpanel/getPageType';
import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

import DeFiDropdownItem from './DeFiDropdownItem';

const feature = config.features.deFi;

function getUrl(feature: { url: string } | { dappId: string }): { url?: string; nextRoute?: Route } {
  return {
    url: 'url' in feature ? feature.url : undefined,
    nextRoute: 'dappId' in feature ? { pathname: '/apps/[id]', query: { id: feature.dappId, action: 'connect' } } : undefined,
  };
}

const DeFiDropdown = () => {
  const router = useRouter();
  const source = getPageType(router.pathname);
  const isMobile = useIsMobile();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleClick = React.useCallback((content: 'Swap button' | 'Payment link') => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: content, Source: source });
  }, [ source ]);

  const items = React.useMemo(() => {
    if (!feature.isEnabled) {
      return [];
    }

    const items = [];

    if (feature.swapButton) {
      items.push({
        icon: 'swap' as const,
        text: 'Swap',
        onClick: () => handleClick('Swap button'),
        ...getUrl(feature.swapButton),
      });
    }

    if (feature.paymentLink) {
      items.push({
        icon: 'payment_link' as const,
        text: 'Payment link',
        onClick: () => handleClick('Payment link'),
        ...getUrl(feature.paymentLink),
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
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Button
          onClick={ onToggle }
          { ...buttonStyles }
          bgColor={ isOpen ? 'blue.400' : undefined }
          _active={{ bgColor: 'blue.400' }}
        >
          { !isMobile && 'Blockscout' } DeFi
          <IconSvg name="arrows/south-mini" boxSize={ 4 } ml={ 1 }/>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody >
          <Flex flexDirection="column" gap={ 1 }>
            { items.map((item, index) => (
              <DeFiDropdownItem key={ index } item={ item }/>
            )) }
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : (
    <Button
      as="a"
      href={ items[0].nextRoute ? route(items[0].nextRoute) : items[0].url }
      target={ items[0].nextRoute ? '_self' : '_blank' }
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
