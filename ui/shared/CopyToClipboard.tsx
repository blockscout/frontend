import React, { useEffect, useState } from 'react';

import { IconButton, Tooltip, useClipboard } from '@chakra-ui/react';
import CopyIcon from 'icons/copy.svg';

const CopyToClipboard = ({ text }: {text: string}) => {
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
        variant="iconBlue"
        onClick={ onCopy }
      />
    </Tooltip>
  );
}

export default CopyToClipboard;
