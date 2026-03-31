import { Separator, VStack } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

import { useCsvExportContext } from '../../utils/context';
import CsvExportDownloadsItem from './CsvExportDownloadsItem';

// TODO @tom2drum new item indicator

const CsvExportDownloads = () => {
  const { dialogOpen, onDialogOpenChange, items } = useCsvExportContext();

  if (items.length === 0) {
    return null;
  }

  return (
    <PopoverRoot open={ dialogOpen } onOpenChange={ onDialogOpenChange }>
      <PopoverTrigger>
        <IconButton
          aria-label="Open list of downloads"
          variant="link"
          size="2xs"
          borderRadius="sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
            <path
              fill="currentColor"
              // eslint-disable-next-line max-len
              d="M10.95 11.897c0 .212.257.318.406.168l4.021-4.021a.95.95 0 1 1 1.345 1.344l-6.05 6.05a.95.95 0 0 1-1.344 0l-6.05-6.05a.95.95 0 0 1 1.345-1.344l4.02 4.02c.15.15.406.045.406-.167V1.85a.95.95 0 0 1 1.902 0z"/>
            <rect width="14" height="2" x="3" y="17" fill="currentColor" rx="1"/>
          </svg>
        </IconButton>
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
                key={ item.request_id }
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
