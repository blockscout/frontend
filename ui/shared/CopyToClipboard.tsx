import { IconButton, Tooltip, useClipboard, chakra } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import CopyIcon from 'icons/copy.svg';

const CopyToClipboard = ({ text, className }: {text: string; className?: string}) => {
  const { hasCopied, onCopy } = useClipboard(text, 3000);
  const [ copied, setCopied ] = useState(false);

  useEffect(() => {
    if (hasCopied) {
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, [ hasCopied ]);

  return (
    <Tooltip label={ copied ? 'Copied' : 'Copy to clipboard' } closeOnClick={ false }>
      <IconButton
        aria-label="copy"
        icon={ <CopyIcon/> }
        w="20px"
        h="20px"
        variant="simple"
        display="inline-block"
        flexShrink={ 0 }
        onClick={ onCopy }
        className={ className }
      />
    </Tooltip>
  );
};

export default chakra(CopyToClipboard);
