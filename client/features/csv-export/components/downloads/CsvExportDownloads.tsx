import { Flex, Separator, VStack } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Status } from 'toolkit/chakra/status';
import IconSvg from 'ui/shared/IconSvg';

import { useCsvExportContext } from '../../utils/context';
import CsvExportDownloadsItem from './CsvExportDownloadsItem';

const CsvExportDownloads = () => {
  const { dialogOpen, onDialogOpenChange, items } = useCsvExportContext();

  if (items.length === 0) {
    return null;
  }

  return (
    <PopoverRoot open={ dialogOpen } onOpenChange={ onDialogOpenChange }>
      <PopoverTrigger>
        <Flex alignItems="center">
          <Flex position="relative">
            <IconButton
              aria-label="Open list of downloads"
              variant="link"
              size="2xs"
              borderRadius="none"
            >
              <IconSvg name="download"/>
            </IconButton>
            { items.some((item) => item.is_highlighted) && (
              <Status
                size="xs"
                position="absolute"
                top="0"
                right="0"
                borderColor={{ _light: 'theme.topbar.bg._light', _dark: 'theme.topbar.bg._dark' }}
              />
            ) }
          </Flex>
          <Separator orientation="vertical" mx={ 2 } h={ 4 }/>
        </Flex>
      </PopoverTrigger>
      <PopoverContent w="300px" maxH="400px" overflowY="auto">
        <PopoverBody textStyle="sm">
          <VStack
            separator={ <Separator orientation="horizontal"/> }
            alignItems="stretch"
            gap={ 3 }
          >
            { items.map((item, index) => (
              <CsvExportDownloadsItem
                key={ `${ item.request_id }_${ item.status }` }
                index={ items.length - index }
                data={ item }
              />
            )) }
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(CsvExportDownloads);
