import { Center } from '@chakra-ui/react';
import React from 'react';

import ContentLoader from 'ui/shared/ContentLoader';

import useThemeColors from './utils/useThemeColors';

const CodeEditorLoading = () => {
  const themeColors = useThemeColors();

  return (
    <Center bgColor={ themeColors['editor.background'] } w="100%" h="100%">
      <ContentLoader/>
    </Center>
  );
};

export default React.memo(CodeEditorLoading);
