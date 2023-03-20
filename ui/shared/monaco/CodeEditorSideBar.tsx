import type { HTMLChakraProps } from '@chakra-ui/react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react';
import _throttle from 'lodash/throttle';
import React from 'react';

import type { File, Monaco } from './types';

import CodeEditorFileExplorer from './CodeEditorFileExplorer';
import CodeEditorSearch from './CodeEditorSearch';
import useColors from './utils/useColors';

interface Props {
  monaco: Monaco | undefined;
  data: Array<File>;
  onFileSelect: (index: number, lineNumber?: number) => void;
  selectedFile: string;
}

const CodeEditorSideBar = ({ onFileSelect, data, monaco, selectedFile }: Props) => {

  const [ isStuck, setIsStuck ] = React.useState(false);

  const tabProps: HTMLChakraProps<'button'> = {
    fontFamily: 'heading',
    textTransform: 'uppercase',
    fontSize: '11px',
    lineHeight: '35px',
    fontWeight: 500,
    color: useColorModeValue('gray.600', 'gray.400'),
    _selected: {
      color: useColorModeValue('black', 'white'),
    },
    px: 0,
    letterSpacing: 0.3,
  };

  const colors = useColors();

  const handleScrollThrottled = React.useRef(_throttle((event: React.SyntheticEvent) => {
    setIsStuck((event.target as HTMLDivElement).scrollTop > 0);
  }, 100));

  return (
    <Box w="250px" flexShrink={ 0 } bgColor={ colors.panels.bgColor } fontSize="13px" overflowY="scroll" onScroll={ handleScrollThrottled.current } pb="22px">
      <Tabs isLazy lazyBehavior="keepMounted" variant="unstyled" size="13px">
        <TabList
          columnGap={ 3 }
          position="sticky"
          top={ 0 }
          left={ 0 }
          bgColor={ colors.panels.bgColor }
          zIndex="1"
          px={ 2 }
          boxShadow={ isStuck ? 'md' : 'none' }
          borderTopRightRadius="md"
        >
          <Tab { ...tabProps }>Explorer</Tab>
          <Tab { ...tabProps }>Search</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={ 0 }>
            <CodeEditorFileExplorer data={ data } onFileSelect={ onFileSelect } selectedFile={ selectedFile }/>
          </TabPanel>
          <TabPanel p={ 0 }>
            <CodeEditorSearch data={ data } onFileSelect={ onFileSelect } monaco={ monaco } isInputStuck={ isStuck }/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default React.memo(CodeEditorSideBar);
