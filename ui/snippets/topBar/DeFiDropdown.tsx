import { Button, Box, Flex, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getPageType from 'lib/mixpanel/getPageType';
import * as mixpanel from 'lib/mixpanel/index';
import Popover from 'ui/shared/chakra/Popover';
import IconSvg from 'ui/shared/IconSvg';

import DeFiDropdownItem from './DeFiDropdownItem';

const feature = config.features.deFiDropdown;

const DeFiDropdown = () => {
  const router = useRouter();
  const source = getPageType(router.pathname);
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleClick = React.useCallback((content: string) => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: content, Source: source });
  }, [ source ]);

  if (!feature.isEnabled) {
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

  const items = feature.items.map((item) => ({
    ...item,
    onClick: () => handleClick(item.text),
  }));

  return items.length > 1 ? (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Button
          onClick={ onToggle }
          isActive={ isOpen }
          { ...buttonStyles }
        >
          <chakra.span display={{ base: 'none', lg: 'inline' }} mr={ 1 }>
            Blockscout
          </chakra.span>
          DeFi
          <IconSvg name="arrows/east-mini" boxSize={ 4 } ml={ 1 } transform="rotate(-90deg)"/>
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
      href={ items[0].dappId ? route({ pathname: '/apps/[id]', query: { id: items[0].dappId, action: 'connect' } }) : items[0].url }
      target={ items[0].dappId ? '_self' : '_blank' }
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

export default chakra(React.memo(DeFiDropdown));
