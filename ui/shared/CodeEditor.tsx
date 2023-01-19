import { chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type ReactAce from 'react-ace/lib/ace';

interface Props {
  id: string;
  value: string;
  className?: string;
}

const CodeEditorBase = chakra(({ id, value, className }: Props) => {

  const [ AceEditor, setAceEditor ] = React.useState<{default: typeof ReactAce} | null>(null);

  React.useEffect(() => {
    const load = async() => {
      const component = await import('react-ace');
      await import('ace-builds/src-noconflict/mode-csharp');
      await import('ace-builds/src-noconflict/theme-tomorrow');
      await import('ace-builds/src-noconflict/theme-tomorrow_night');
      await import('ace-builds/src-noconflict/ext-language_tools');
      setAceEditor(component);
    };

    load();

    return () => {
      setAceEditor(null);
    };
  }, []);

  const theme = useColorModeValue('tomorrow', 'tomorrow_night');

  if (!AceEditor) {
    return null;
  }

  return (
    <AceEditor.default
      className={ className }
      mode="csharp" // TODO need to find mode for solidity
      theme={ theme }
      value={ value }
      name={ id }
      editorProps={{ $blockScrolling: true }}
      readOnly
      width="100%"
      showPrintMargin={ false }
      maxLines={ 25 }
    />
  );
});

const CodeEditor = ({ id, value }: Props) => {
  // see theme/components/Textarea.ts variantFilledInactive
  const bgColor = useColorModeValue('#f5f5f6', '#1a1b1b');
  const gutterBgColor = useColorModeValue('gray.100', '#25282c');

  return (
    <CodeEditorBase
      id={ id }
      value={ value }
      bgColor={ bgColor }
      borderRadius="md"
      overflow="hidden"
      sx={{
        '.ace_gutter': {
          backgroundColor: gutterBgColor,
        },
      }}
    />
  );
};

export default React.memo(CodeEditor);
