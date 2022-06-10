import React, { useCallback, useEffect } from 'react';

import { Icon, useClipboard, useToast } from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';

const WatchListAddressItem = ({ text }: {text: string}) => {
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
  return <Icon as={ FaCopy } w="15px" h="15px" color="blue.500" cursor="pointer" onClick={ copyToClipboardCallback }/>;
}

export default WatchListAddressItem;
