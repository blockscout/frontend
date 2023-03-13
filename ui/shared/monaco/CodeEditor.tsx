import { Box, useColorMode, Flex } from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

import type { File } from './types';

import CodeEditorSideBar from './CodeEditorSideBar';
import * as themes from './utils/themes';

export type Monaco = typeof monaco;

interface Props {
  data: Array<File>;
}

const CodeEditor = ({ data }: Props) => {
  const instance = React.useRef<Monaco>();
  const [ index, setIndex ] = React.useState(0);

  const { colorMode } = useColorMode();

  React.useEffect(() => {
    instance.current?.editor.setTheme(colorMode === 'light' ? 'blockscout-light' : 'blockscout-dark');
  }, [ colorMode ]);

  const handleEditorDidMount = React.useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    instance.current = monaco;

    monaco.editor.defineTheme('blockscout-light', themes.light);
    monaco.editor.defineTheme('blockscout-dark', themes.dark);
    monaco.editor.setTheme(colorMode === 'light' ? 'blockscout-light' : 'blockscout-dark');
  // componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  return (
    <Flex overflow="hidden" borderRadius="md" height="500px">
      <Box flexGrow={ 1 }>
        <MonacoEditor
          language="sol"
          path={ data[index].file_path }
          defaultValue={ data[index].source_code }
          options={{ readOnly: true, inlayHints: { enabled: 'off' }, minimap: { enabled: false } }}
          onMount={ handleEditorDidMount }
        />
      </Box>
      <CodeEditorSideBar data={ data } onFileSelect={ setIndex }/>
    </Flex>
  );
};

export default React.memo(CodeEditor);
