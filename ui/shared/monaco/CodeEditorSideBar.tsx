import type { HTMLChakraProps } from '@chakra-ui/react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';

import type { File, Monaco } from './types';

import CodeEditorFileExplorer from './CodeEditorFileExplorer';
import CodeEditorSearch from './CodeEditorSearch';

interface Props {
  monaco: Monaco | undefined;
  data: Array<File>;
  onFileSelect: (index: number, lineNumber?: number) => void;
}

const CodeEditorSideBar = ({ onFileSelect, data, monaco }: Props) => {

  const tabProps: HTMLChakraProps<'button'> = {
    fontFamily: 'heading',
    textTransform: 'uppercase',
    fontSize: 'xs',
    fontWeight: 500,
    color: 'gray.600',
    _selected: {
      color: 'black',
    },
    px: 0,
    letterSpacing: 0.3,
  };

  return (
    <Box w="250px" flexShrink={ 0 } bgColor="lightpink" fontSize="sm" overflowY="scroll" px={ 3 } position="relative">
      <Tabs isLazy lazyBehavior="keepMounted" variant="unstyled" size="sm">
        <TabList columnGap={ 3 }>
          <Tab { ...tabProps }>Explorer</Tab>
          <Tab { ...tabProps }>Search</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={ 0 }>
            <CodeEditorFileExplorer data={ data } onFileSelect={ onFileSelect }/>
          </TabPanel>
          <TabPanel p={ 0 }>
            <CodeEditorSearch data={ data } onFileSelect={ onFileSelect } monaco={ monaco }/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default React.memo(CodeEditorSideBar);
