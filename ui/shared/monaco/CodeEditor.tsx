import { Box, useColorMode, Flex } from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

import type { File, Monaco } from './types';

import CodeEditorSideBar from './CodeEditorSideBar';
import * as themes from './utils/themes';

const EDITOR_OPTIONS = {
  readOnly: true,
  minimap: { enabled: false },
};

interface Props {
  data: Array<File>;
}

const CodeEditor = ({ data }: Props) => {
  const [ instance, setInstance ] = React.useState<Monaco | undefined>();
  const [ index, setIndex ] = React.useState(0);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();

  const { colorMode } = useColorMode();

  React.useEffect(() => {
    instance?.editor.setTheme(colorMode === 'light' ? 'blockscout-light' : 'blockscout-dark');
  }, [ colorMode, instance?.editor ]);

  const handleEditorDidMount = React.useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    setInstance(monaco);
    editorRef.current = editor;

    monaco.editor.defineTheme('blockscout-light', themes.light);
    monaco.editor.defineTheme('blockscout-dark', themes.dark);
    monaco.editor.setTheme(colorMode === 'light' ? 'blockscout-light' : 'blockscout-dark');

    data.slice(1).forEach((file) => {
      monaco.editor.createModel(file.source_code, 'sol', monaco.Uri.parse(file.file_path));
    });
  // componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const handleSelectFile = React.useCallback((index: number, lineNumber?: number) => {
    setIndex(index);
    if (lineNumber !== undefined && !Object.is(lineNumber, NaN)) {
      window.setTimeout(() => {
        editorRef.current?.revealLineInCenter(lineNumber);
      }, 0);
    }
  }, []);

  return (
    <Flex overflow="hidden" borderRadius="md" height="500px">
      <Box flexGrow={ 1 }>
        <MonacoEditor
          language="sol"
          path={ data[index].file_path }
          defaultValue={ data[index].source_code }
          options={ EDITOR_OPTIONS }
          onMount={ handleEditorDidMount }
        />
      </Box>
      <CodeEditorSideBar data={ data } onFileSelect={ handleSelectFile } monaco={ instance }/>
    </Flex>
  );
};

export default React.memo(CodeEditor);
