import {
  Text,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  chakra,
  Box,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import Popover from 'ui/shared/chakra/Popover';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';

interface Props {
  className?: string;
  links?: Array<{ title: string; url: string }>;
}

const MarketplaceAppGraphLinks = ({ className, links }: Props) => {
  const isMobile = useIsMobile();

  const handleButtonClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <Box position="relative" className={ className } display="inline-flex" alignItems="center" height={ 7 } onClick={ handleButtonClick }>
      <Popover
        placement={ isMobile ? 'bottom-end' : 'bottom' }
        isLazy
        trigger="hover"
      >
        <PopoverTrigger>
          <IconSvg name="brands/graph" boxSize={ 5 } onClick={ handleButtonClick }/>
        </PopoverTrigger>
        <PopoverContent w="260px">
          <PopoverBody fontSize="sm">
            <VStack gap={ 4 } align="start">
              <Text>{ `This dapp uses ${ links.length > 1 ? 'several subgraphs' : 'a subgraph' } powered by The Graph` }</Text>
              { links.map(link => (
                <LinkExternal key={ link.url } href={ link.url }>{ link.title }</LinkExternal>
              )) }
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default React.memo(chakra(MarketplaceAppGraphLinks));
