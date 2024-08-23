import { Box, DarkMode, PopoverBody, PopoverContent, PopoverTrigger, Portal, useColorModeValue, Flex, PopoverArrow } from '@chakra-ui/react';
import React from 'react';

import Popover from 'ui/shared/chakra/Popover';
import * as EntityBase from 'ui/shared/entities/base/components';

import type { ContentProps } from './AddressEntity';
import AddressEntity from './AddressEntity';

const AddressEntityContentProxy = (props: ContentProps) => {
  const bgColor = useColorModeValue('gray.700', 'gray.900');

  const implementations = props.address.implementations;

  const handleClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  if (!implementations || implementations.length === 0) {
    return null;
  }

  const colNum = Math.min(implementations.length, 3);
  const nameTag = props.address.metadata?.tags.find(tag => tag.tagType === 'name')?.name;

  const implementationName = implementations.length === 1 && implementations[0].name ? implementations[0].name : undefined;

  return (
    <Popover trigger="hover" isLazy gutter={ 8 }>
      <PopoverTrigger>
        <Box display="inline-flex" w="100%">
          <EntityBase.Content
            { ...props }
            truncation={ nameTag || implementationName || props.address.name ? 'tail' : props.truncation }
            text={ nameTag || implementationName || props.address.name || props.address.hash }
            isTooltipDisabled
          />
        </Box>
      </PopoverTrigger>
      <Portal>
        <DarkMode>
          <PopoverContent bgColor={ bgColor } w="fit-content" borderRadius="sm" maxW={{ base: '100vw', lg: '410px' }} onClick={ handleClick }>
            <PopoverArrow bgColor={ bgColor }/>
            <PopoverBody color="white" p={ 2 } fontSize="sm" lineHeight={ 5 } textAlign="center">
              <Box fontWeight={ 600 }>
                Proxy contract
                { props.address.name ? ` (${ props.address.name })` : '' }
              </Box>
              <AddressEntity address={{ hash: props.address.hash }} noLink noIcon noHighlight justifyContent="center"/>
              <Box fontWeight={ 600 } mt={ 2 }>
                Implementation{ implementations.length > 1 ? 's' : '' }
                { implementationName ? ` (${ implementationName })` : '' }
              </Box>
              <Flex flexWrap="wrap" columnGap={ 3 }>
                { implementations.map((item) => (
                  <AddressEntity
                    key={ item.address }
                    address={{ hash: item.address }}
                    noLink
                    noIcon
                    noHighlight
                    minW={ `calc((100% - ${ colNum - 1 } * 12px) / ${ colNum })` }
                    flex={ 1 }
                    justifyContent={ colNum === 1 ? 'center' : undefined }
                  />
                )) }
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </DarkMode>
      </Portal>
    </Popover>
  );
};

export default React.memo(AddressEntityContentProxy);
