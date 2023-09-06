import { IconButton, Tooltip, useClipboard, chakra, useDisclosure, Skeleton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import CopyIcon from 'icons/copy.svg';

export interface Props {
  text: string;
  className?: string;
  isLoading?: boolean;
}

const CopyToClipboard = ({ text, className, isLoading }: Props) => {
  const { hasCopied, onCopy } = useClipboard(text, 1000);
  const [ copied, setCopied ] = useState(false);
  // have to implement controlled tooltip because of the issue - https://github.com/chakra-ui/chakra-ui/issues/7107
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (hasCopied) {
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, [ hasCopied ]);

  if (isLoading) {
    return <Skeleton boxSize={ 5 } className={ className } borderRadius="sm" flexShrink={ 0 } ml={ 2 }/>;
  }

  return (
    <Tooltip label={ copied ? 'Copied' : 'Copy to clipboard' } isOpen={ isOpen || copied }>
      <IconButton
        aria-label="copy"
        icon={ <CopyIcon/> }
        w="20px"
        h="20px"
        color="gray.400"
        variant="simple"
        display="inline-block"
        flexShrink={ 0 }
        onClick={ onCopy }
        className={ className }
        onMouseEnter={ onOpen }
        onMouseLeave={ onClose }
        ml={ 2 }
        borderRadius={ 0 }
      />
    </Tooltip>
  );
};

export default React.memo(chakra(CopyToClipboard));
