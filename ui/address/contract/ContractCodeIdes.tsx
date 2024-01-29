import { Flex, Button, chakra, Popover, PopoverTrigger, PopoverBody, PopoverContent, useDisclosure, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/LinkExternal';

interface Props {
  className?: string;
  hash: string;
}

const ContractCodeIde = ({ className, hash }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const defaultIconColor = useColorModeValue('gray.600', 'gray.500');

  const ideLinks = React.useMemo(() => {
    return config.UI.ides.items
      .map((ide) => {
        const url = decodeURIComponent(ide.url.replace('{hash}', hash).replace('{domain}', config.app.host || ''));
        const icon = 'icon_url' in ide ?
          <Image boxSize={ 5 } mr={ 2 } src={ ide.icon_url } alt={ `${ ide.title } icon` }/> :
          <IconSvg name="ABI_slim" boxSize={ 5 } color={ defaultIconColor } mr={ 2 }/>;

        return (
          <LinkExternal key={ ide.title } href={ url } display="inline-flex" alignItems="center">
            { icon }
            { ide.title }
          </LinkExternal>
        );
      });
  }, [ defaultIconColor, hash ]);

  if (ideLinks.length === 0) {
    return null;
  }

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Button
          className={ className }
          size="sm"
          variant="outline"
          colorScheme="gray"
          onClick={ onToggle }
          aria-label="Open source code in IDE"
          fontWeight={ 500 }
          px={ 2 }
          h="32px"
          flexShrink={ 0 }
        >
          <span>Open in</span>
          <IconSvg name="arrows/east-mini" transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 }/>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="240px">
        <PopoverBody >
          <chakra.span color="text_secondary" fontSize="xs">Redactors</chakra.span>
          <Flex
            flexDir="column"
            alignItems="flex-start"
            columnGap={ 6 }
            rowGap={ 3 }
            mt={ 3 }
          >
            { ideLinks }
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(chakra(ContractCodeIde));
