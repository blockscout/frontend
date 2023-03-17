import { Box, useColorMode, Flex } from '@chakra-ui/react';
import type { EditorProps } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

import type { File, Monaco } from './types';

import CodeEditorBreadcrumbs from './CodeEditorBreadcrumbs';
import CodeEditorSideBar from './CodeEditorSideBar';
import CodeEditorTabs from './CodeEditorTabs';
import * as themes from './utils/themes';

const EDITOR_OPTIONS: EditorProps['options'] = {
  readOnly: true,
  minimap: { enabled: false },
  scrollbar: {
    alwaysConsumeMouseWheel: true,
  },
};

interface Props {
  data: Array<File>;
}

const CodeEditor = ({ data }: Props) => {
  const [ instance, setInstance ] = React.useState<Monaco | undefined>();
  const [ index, setIndex ] = React.useState(0);
  const [ tabs, setTabs ] = React.useState([ data[index].file_path ]);
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
    setTabs((prev) => prev.some((item) => item === data[index].file_path) ? prev : ([ ...prev, data[index].file_path ]));
    if (lineNumber !== undefined && !Object.is(lineNumber, NaN)) {
      window.setTimeout(() => {
        editorRef.current?.revealLineInCenter(lineNumber);
      }, 0);
    }
  }, [ data ]);

  const handleTabSelect = React.useCallback((path: string) => {
    const index = data.findIndex((item) => item.file_path === path);
    if (index > -1) {
      setIndex(index);
    }
  }, [ data ]);

  const handleTabClose = React.useCallback((path: string) => {
    setTabs((prev) => {
      if (prev.length > 1) {
        const tabIndex = prev.findIndex((item) => item === path);
        const isActive = data[index].file_path === path;

        if (isActive) {
          const nextActiveIndex = data.findIndex((item) => item.file_path === prev[Math.max(0, tabIndex - 1)]);
          setIndex(nextActiveIndex);
        }

        return prev.filter((item) => item !== path);
      }

      return prev;
    });
  }, [ data, index ]);

  return (
    <Flex overflow="hidden" borderRadius="md" height="540px" position="relative">
      <Box flexGrow={ 1 }>
        <CodeEditorTabs tabs={ tabs } activeTab={ data[index].file_path } onTabSelect={ handleTabSelect } onTabClose={ handleTabClose }/>
        <CodeEditorBreadcrumbs path={ data[index].file_path }/>
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
