import type { HTMLChakraProps } from '@chakra-ui/react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react';
import _throttle from 'lodash/throttle';
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

  const [ isStuck, setIsStuck ] = React.useState(false);

  const tabProps: HTMLChakraProps<'button'> = {
    fontFamily: 'heading',
    textTransform: 'uppercase',
    fontSize: '11px',
    lineHeight: '35px',
    fontWeight: 500,
    color: 'gray.600',
    _selected: {
      color: 'black',
    },
    px: 0,
    letterSpacing: 0.3,
  };

  const bgColor = useColorModeValue('#eee', '#222');

  const handleScrollThrottled = React.useRef(_throttle((event: React.SyntheticEvent) => {
    setIsStuck((event.target as HTMLDivElement).scrollTop > 0);
  }, 100));

  return (
    <Box w="250px" flexShrink={ 0 } bgColor={ bgColor } fontSize="13px" overflowY="scroll" onScroll={ handleScrollThrottled.current }>
      <Tabs isLazy lazyBehavior="keepMounted" variant="unstyled" size="13px">
        <TabList
          columnGap={ 3 }
          position="sticky"
          top={ 0 }
          left={ 0 }
          bgColor={ bgColor }
          zIndex="1"
          px={ 2 }
          boxShadow={ isStuck ? 'md' : 'none' }
          borderTopRadius="md"
        >
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
