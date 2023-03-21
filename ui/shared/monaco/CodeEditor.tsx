import { Box, useColorMode, Flex } from '@chakra-ui/react';
import type { EditorProps } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

import type { File, Monaco } from './types';

import useClientRect from 'lib/hooks/useClientRect';

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

const TABS_HEIGHT = 35;
const BREADCRUMBS_HEIGHT = 22;
const SIDE_BAR_WIDTH = 250;
const EDITOR_HEIGHT = 500;

interface Props {
  data: Array<File>;
}

const CodeEditor = ({ data }: Props) => {
  const [ instance, setInstance ] = React.useState<Monaco | undefined>();
  const [ index, setIndex ] = React.useState(0);
  const [ tabs, setTabs ] = React.useState([ data[index].file_path ]);

  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  const [ containerRect, containerNodeRef ] = useClientRect<HTMLDivElement>();

  const { colorMode } = useColorMode();
  const editorWidth = containerRect ? containerRect.width - SIDE_BAR_WIDTH : 0;

  React.useEffect(() => {
    instance?.editor.setTheme(colorMode === 'light' ? 'blockscout-light' : 'blockscout-dark');
  }, [ colorMode, instance?.editor ]);

  const handleEditorDidMount = React.useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    setInstance(monaco);
    editorRef.current = editor;

    monaco.editor.defineTheme('blockscout-light', themes.light);
    monaco.editor.defineTheme('blockscout-dark', themes.dark);
    monaco.editor.setTheme(colorMode === 'light' ? 'blockscout-light' : 'blockscout-dark');

    const loadedModelsPaths = monaco.editor.getModels().map((model) => model.uri.path);
    data.slice(1)
      .filter((file) => !loadedModelsPaths.includes(file.file_path))
      .forEach((file) => {
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

  const containerSx = React.useMemo(() => ({
    '.editor-container': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: `${ editorWidth }px`,
      height: '100%',
    },
  }), [ editorWidth ]);

  if (data.length === 1) {
    return (
      <Box overflow="hidden" borderRadius="md" height={ `${ EDITOR_HEIGHT }px` }>
        <MonacoEditor
          language="sol"
          path={ data[index].file_path }
          defaultValue={ data[index].source_code }
          options={ EDITOR_OPTIONS }
          onMount={ handleEditorDidMount }
        />
      </Box>
    );
  }

  return (
    <Flex
      overflow="hidden"
      borderRadius="md"
      width="100%"
      height={ `${ EDITOR_HEIGHT + TABS_HEIGHT + BREADCRUMBS_HEIGHT }px` }
      position="relative"
      ref={ containerNodeRef }
      sx={ containerSx }
    >
      <Box flexGrow={ 1 }>
        <CodeEditorTabs tabs={ tabs } activeTab={ data[index].file_path } onTabSelect={ handleTabSelect } onTabClose={ handleTabClose }/>
        <CodeEditorBreadcrumbs path={ data[index].file_path }/>
        <MonacoEditor
          className="editor-container"
          height={ `${ EDITOR_HEIGHT }px` }
          language="sol"
          path={ data[index].file_path }
          defaultValue={ data[index].source_code }
          options={ EDITOR_OPTIONS }
          onMount={ handleEditorDidMount }
        />
      </Box>
      <CodeEditorSideBar data={ data } onFileSelect={ handleSelectFile } monaco={ instance } selectedFile={ data[index].file_path }/>
    </Flex>
  );
};

export default React.memo(CodeEditor);
