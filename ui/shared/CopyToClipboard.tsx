import React, { useCallback, useEffect } from 'react';

import { Icon, useClipboard, useToast } from '@chakra-ui/react';
import CopyIcon from '../../icons/copy.svg';

const CopyToClipboard = ({ text }: {text: string}) => {
  const { hasCopied, onCopy } = useClipboard(text);
  const toast = useToast();

  useEffect(() => {
    if (hasCopied) {
      toast({
        description: 'Copied',
        status: 'success',
        duration: 3000,
      })
    }
  }, [ toast, hasCopied ]);

  const copyToClipboardCallback = useCallback(() => onCopy(), [ onCopy ]);
  return <Icon as={ CopyIcon } w="20px" h="20px" color="blue.500" cursor="pointer" onClick={ copyToClipboardCallback }/>;
}

export default CopyToClipboard;
