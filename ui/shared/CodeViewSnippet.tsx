import { Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CodeEditor from 'ui/shared/monaco/CodeEditor';

interface Props {
  data: string;
  copyData?: string;
  language: string;
  title?: string;
  className?: string;
  rightSlot?: React.ReactNode;
  isLoading?: boolean;
}

const CodeViewSnippet = ({ data, copyData, language, title, className, rightSlot, isLoading }: Props) => {

  const editorData = React.useMemo(() => {
    return [ { file_path: 'index', source_code: data } ];
  }, [ data ]);

  return (
    <Box className={ className } as="section" title={ title }>
      { (title || rightSlot) && (
        <Flex justifyContent={ title ? 'space-between' : 'flex-end' } alignItems="center" mb={ 3 }>
          { title && <Skeleton fontWeight={ 500 } isLoaded={ !isLoading }>{ title }</Skeleton> }
          { rightSlot }
          <CopyToClipboard text={ copyData ?? data } isLoading={ isLoading }/>
        </Flex>
      ) }
      { isLoading ? <Skeleton height="500px" w="100%"/> : <CodeEditor data={ editorData } language={ language }/> }
    </Box>
  );
};

export default React.memo(chakra(CodeViewSnippet));
