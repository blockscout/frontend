import { Box, useColorMode } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';
export type Monaco = typeof monaco;

interface Props {
  data: Array<{ file_path: string; source_code: string }>;
}

const CodeEditorMonaco = ({ data }: Props) => {
  const instance = React.useRef<Monaco>();

  const { colorMode } = useColorMode();

  React.useEffect(() => {
    instance.current?.editor.setTheme(colorMode === 'light' ? 'blockscout-light' : 'blockscout-dark');
  }, [ colorMode ]);

  const handleEditorDidMount = React.useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    instance.current = monaco;

    monaco.editor.defineTheme('blockscout-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#f5f5f6',
      },
    });

    monaco.editor.defineTheme('blockscout-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1b1b',
      },
    });

    monaco.editor.setTheme(colorMode === 'light' ? 'blockscout-light' : 'blockscout-dark');
  // componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  return (
    <Box overflow="hidden" borderRadius="md">
      <Editor
        height="500px"
        language="sol"
        defaultValue={ data[0].source_code }
        options={{ readOnly: true, inlayHints: { enabled: 'off' }, minimap: { enabled: false } }}
        onMount={ handleEditorDidMount }
      />
    </Box>
  );
};

export default CodeEditorMonaco;
