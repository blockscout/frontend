import { Box, Flex, Tooltip } from '@chakra-ui/react';
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
  const [ activePanelIndex, setActivePanelIndex ] = React.useState(0);

  const PANELS = React.useMemo(() => ([
    { id: 'explorer', label: 'Explorer', text: 'E', component: <CodeEditorFileExplorer data={ data } onFileSelect={ onFileSelect }/> },
    { id: 'search', label: 'Search', text: 'S', component: <CodeEditorSearch data={ data } onFileSelect={ onFileSelect } monaco={ monaco }/> },
  ]), [ data, monaco, onFileSelect ]);

  const activePanel = PANELS[activePanelIndex];

  const handleTabClick = React.useCallback((event: React.MouseEvent) => {
    const id = (event.currentTarget as HTMLDivElement).getAttribute('data-id');
    const index = PANELS.findIndex((item) => item.id === id);
    if (index > -1) {
      setActivePanelIndex(index);
    }
  }, [ PANELS ]);

  return (
    <Box w="250px" flexShrink={ 0 } bgColor="lightpink" fontSize="sm" overflowY="scroll" px={ 3 }>
      <Flex>
        <Box fontFamily="heading" letterSpacing={ 0.5 } fontWeight={ 600 } textTransform="uppercase" lineHeight={ 6 }>
          { activePanel.label }
        </Box>
        <Flex ml="auto" columnGap={ 2 }>
          { PANELS.map(({ id, text, label }) => (
            <Tooltip key={ id } label={ label }>
              <Box data-id={ id } boxSize={ 6 } cursor="pointer" textAlign="center" bgColor="lightblue" onClick={ handleTabClick }>
                { text }
              </Box>
            </Tooltip>
          )) }
        </Flex>
      </Flex>
      { activePanel.component }
    </Box>
  );
};

export default React.memo(CodeEditorSideBar);
