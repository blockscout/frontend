import { Box, DarkMode, Popover, PopoverBody, PopoverContent, PopoverTrigger, Portal, useColorModeValue, Flex, PopoverArrow } from '@chakra-ui/react';
import React from 'react';

import type { AddressImplementation } from 'types/api/addressParams';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import TruncatedValue from 'ui/shared/TruncatedValue';

import type { ContentProps } from './AddressEntity';

interface ItemProps extends AddressImplementation {
  colNum: number;
  onClick: (event: React.MouseEvent) => void;
}

const ImplementationItem = ({ address, name, colNum }: ItemProps) => {

  return (
    <Flex
      minW={ `calc((100% - ${ colNum - 1 } * 12px) / ${ colNum })` }
      flex={ 1 }
      justifyContent={ colNum === 1 ? 'center' : undefined }
    >
      { name ?
        <TruncatedValue value={ name }/> : (
          <Box overflow="hidden" whiteSpace="nowrap" minW="0">
            <HashStringShortenDynamic hash={ address }/>
          </Box>
        ) }
      <CopyToClipboard text={ address }/>
    </Flex>
  );
};

const AddressEntityContentProxy = ({ address }: ContentProps) => {
  const bgColor = useColorModeValue('gray.700', 'gray.900');

  const implementations = address.implementations;

  const handleClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  if (!implementations || implementations.length === 0) {
    return null;
  }

  const colNum = Math.min(implementations.length, 3);

  return (
    <Popover trigger="hover" isLazy>
      <PopoverTrigger>
        <span>Proxy</span>
      </PopoverTrigger>
      <Portal>
        <DarkMode>
          <PopoverContent bgColor={ bgColor } w="fit-content" borderRadius="sm" maxW={{ base: '100vw', lg: '410px' }} onClick={ handleClick }>
            <PopoverArrow bgColor={ bgColor }/>
            <PopoverBody color="white" p={ 2 } fontSize="sm" lineHeight={ 5 } textAlign="center">
              <Box fontWeight={ 600 }>{ address.name ?? 'Proxy contract' }</Box>
              <Flex>
                <Box overflow="hidden" whiteSpace="nowrap">
                  <HashStringShortenDynamic hash={ address.hash }/>
                </Box>
                <CopyToClipboard text={ address.hash } onClick={ handleClick }/>
              </Flex>
              <Box fontWeight={ 600 } mt={ 2 }>Implementation{ implementations.length > 1 ? 's' : '' }</Box>
              <Flex flexWrap="wrap" columnGap={ 3 }>
                { implementations.map((item) => <ImplementationItem key={ item.address } { ...item } colNum={ colNum } onClick={ handleClick }/>) }
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </DarkMode>
      </Portal>
    </Popover>
  );
};

export default React.memo(AddressEntityContentProxy);
