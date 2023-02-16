import { IconButton, Tooltip, useClipboard, chakra, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import CopyIcon from 'icons/copy.svg';

const CopyToClipboard = ({ text, className }: {text: string; className?: string}) => {
  const { hasCopied, onCopy } = useClipboard(text, 3000);
  const [ copied, setCopied ] = useState(false);
  // have to implement controlled tooltip because of the issue - https://github.com/chakra-ui/chakra-ui/issues/7107
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure();

  useEffect(() => {
    if (hasCopied) {
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, [ hasCopied ]);

  const handleClick = React.useCallback(() => {
    onToggle();
    onCopy();
  }, [ onCopy, onToggle ]);

  return (
    <Tooltip label={ copied ? 'Copied' : 'Copy to clipboard' } isOpen={ isOpen }>
      <IconButton
        aria-label="copy"
        icon={ <CopyIcon/> }
        w="20px"
        h="20px"
        variant="simple"
        display="inline-block"
        flexShrink={ 0 }
        onClick={ handleClick }
        className={ className }
        onMouseEnter={ onOpen }
        onMouseLeave={ onClose }
      />
    </Tooltip>
  );
};

export default React.memo(chakra(CopyToClipboard));
