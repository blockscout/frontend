import { Flex, useColorModeValue } from '@chakra-ui/react';
import type EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import List from '@editorjs/list';
import { YMF } from '@ylide/sdk';
import React from 'react';
import { createReactEditorJS } from 'react-editor-js';

import { editorJsToYMF, ymfToEditorJs } from 'lib/contexts/ylide/editor-utils';

const ReactEditorJS = createReactEditorJS();

export const EDITOR_JS_TOOLS = {
  list: List,
  header: Header,
};

const Editor = ({ value, onChange }: { value: string; onChange?: (val: string) => void }) => {
  const instanceRef = React.useRef<EditorJS>(null);

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBorderColor = useColorModeValue('gray.400', 'gray.500');
  const focusBorderColor = '#63B3ED';

  const textColor = useColorModeValue('gray-700', 'gray-300');
  const selectedBackgroundColor = useColorModeValue('#e1f2ff', '#4a5568');

  const handleSave = React.useCallback(async() => {
    if (instanceRef.current) {
      // https://github.com/codex-team/editor.js/issues/2120
      await instanceRef.current.save();
      const newData = await instanceRef.current.save();
      if (onChange) {
        onChange(editorJsToYMF(newData).toString());
      }
    }
  }, [ onChange ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGetInstanceRef = React.useCallback((instance: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    instanceRef.current = instance.dangerouslyLowLevelInstance;
  }, []);

  const readOnly = !onChange;

  const className = 'edjs-' + Math.random().toString(36).substr(2, 9);

  return (
    <Flex
      w="100%"
      alignItems="stretch"
      flexDir="column"
      border="2px solid"
      borderColor={ readOnly ? 'transparent' : borderColor }
      borderRadius={ readOnly ? 0 : 8 }
      transition="all 0.3s"
      _hover={{
        borderColor: readOnly ? 'transparent' : hoverBorderColor,
      }}
      _focusWithin={{
        borderColor: readOnly ? 'transparent' : focusBorderColor,
      }}
      className={ className }
    >
      <style>{ `
		.${ className } .ce-block__content, .ce-toolbar__content { max-width: none; margin-left: ${ readOnly ? '0px' : '60px' }; }
		.${ className } .ce-toolbar__settings-btn, .ce-toolbar__plus { color: var(--chakra-colors-${ textColor }); }
		.${ className } .codex-editor__redactor { padding-bottom: ${ readOnly ? '0px' : '200px' } !important; }
		.${ className } .ce-block--selected .ce-block__content { background: ${ selectedBackgroundColor }; }
	` }</style>
      <ReactEditorJS
        tools={ EDITOR_JS_TOOLS }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data={ ymfToEditorJs(YMF.fromYMFText(value)) }
        readOnly={ readOnly }
        onChange={ handleSave }
        instanceRef={ handleGetInstanceRef }
        onInitialize={ handleGetInstanceRef }
      />
    </Flex>
  );
};

export default Editor;
