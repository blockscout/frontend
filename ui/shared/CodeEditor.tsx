import { chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/ext-language_tools';

interface Props {
  id: string;
  value: string;
  className?: string;
}

const CodeEditorBase = chakra(({ id, value, className }: Props) => {

  const theme = useColorModeValue('tomorrow', 'tomorrow_night');

  // eslint-disable-next-line no-restricted-properties
  if (process.env.NEXT_PUBLIC_APP_ENV === 'testing') {
    return <chakra.div className={ className }>CodeEditorBase</chakra.div>;
  }

  return (
    <AceEditor
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
