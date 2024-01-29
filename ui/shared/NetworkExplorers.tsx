import {
  Image,
  Button,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  Show,
  Hide,
  useColorModeValue,
  chakra,
  useDisclosure,
  Grid,
} from '@chakra-ui/react';
import React from 'react';

import type { NetworkExplorer as TNetworkExplorer } from 'types/networks';

import config from 'configs/app';
import stripTrailingSlash from 'lib/stripTrailingSlash';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/LinkExternal';

interface Props {
  className?: string;
  type: keyof TNetworkExplorer['paths'];
  pathParam: string;
}

const NetworkExplorers = ({ className, type, pathParam }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const defaultIconColor = useColorModeValue('gray.400', 'gray.500');

  const explorersLinks = React.useMemo(() => {
    return config.UI.explorers.items
      .filter((explorer) => typeof explorer.paths[type] === 'string')
      .map((explorer) => {
        const url = new URL(stripTrailingSlash(explorer.paths[type] || '') + '/' + pathParam, explorer.baseUrl);
        return (
          <LinkExternal h="34px" key={ explorer.baseUrl } href={ url.toString() } alignItems="center" display="inline-flex" minW="120px">
            { explorer.logo ?
              <Image boxSize={ 5 } mr={ 2 } src={ explorer.logo } alt={ `${ explorer.title } icon` }/> :
              <IconSvg name="explorer" boxSize={ 5 } color={ defaultIconColor } mr={ 2 }/>
            }
            { explorer.title }
          </LinkExternal>
        );
      });
  }, [ pathParam, type, defaultIconColor ]);

  if (explorersLinks.length === 0) {
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
          aria-label="Verify in other explorers"
          fontWeight={ 500 }
          px={ 2 }
          h="32px"
          flexShrink={ 0 }
        >
          <IconSvg name="explorer" boxSize={ 5 }/>
          <Show above="xl">
            <chakra.span ml={ 1 }>{ explorersLinks.length } Explorer{ explorersLinks.length > 1 ? 's' : '' }</chakra.span>
          </Show>
          <Hide above="xl">
            <chakra.span ml={ 1 }>{ explorersLinks.length }</chakra.span>
          </Hide>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody >
          <chakra.span color="text_secondary" fontSize="xs">Verify with other explorers</chakra.span>
          <Grid
            alignItems="center"
            templateColumns={ explorersLinks.length > 1 ? 'auto auto' : '1fr' }
            columnGap={ 4 }
            rowGap={ 2 }
            mt={ 3 }
          >
            { explorersLinks }
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(chakra(NetworkExplorers));
