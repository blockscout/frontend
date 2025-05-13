import { chakra } from '@chakra-ui/react';
import React from 'react';

import { LinkOverlay } from 'toolkit/chakra/link';

import type { MediaElementProps } from './utils';

interface Props extends MediaElementProps<'a'> {}

const NftHtml = ({ src, transport, onLoad, onError, onClick, ...rest }: Props) => {
  const ref = React.useRef<HTMLIFrameElement>(null);

  const [ isLoaded, setIsLoaded ] = React.useState(false);

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [ onLoad ]);

  const loadViaHttp = React.useCallback(async() => {
    if (!ref.current) {
      return;
    }

    ref.current.src = src;
    ref.current.onload = handleLoad;
    onError && (ref.current.onerror = onError);
  }, [ src, handleLoad, onError ]);

  React.useEffect(() => {
    switch (transport) {
      case 'ipfs': {
        // Currently we don't support IPFS video loading
        onError?.();
        break;
      }
      case 'http':
        loadViaHttp();
        break;
    }
  }, [ loadViaHttp, onError, transport ]);

  return (
    <LinkOverlay
      onClick={ onClick }
      h="100%"
      { ...rest }
    >
      <chakra.iframe
        ref={ ref }
        h="100%"
        w="100%"
        sandbox="allow-scripts"
        opacity={ isLoaded ? 1 : 0 }
      />
    </LinkOverlay>
  );
};

export default NftHtml;
