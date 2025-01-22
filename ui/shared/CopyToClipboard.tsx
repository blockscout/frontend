import { chakra } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import useClipboard from 'toolkit/hooks/useClipboard';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

export interface Props {
  text: string;
  className?: string;
  isLoading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  size?: number;
  type?: 'link';
  icon?: IconName;
  // TODO @tom2drum check if we need this
  visual?: string;
  // TODO @tom2drum check if we need this
  colorScheme?: string;
}

const CopyToClipboard = ({ text, className, isLoading, onClick, size = 5, type, icon, colorScheme }: Props) => {
  const { hasCopied, copy } = useClipboard(text, 1000);
  // const [ copiedText, copyToClipboard ] = useCopyToClipboard();
  // const [ copied, setCopied ] = useState(false);
  // TODO @tom2drum check if we need this
  // have to implement controlled tooltip because of the issue - https://github.com/chakra-ui/chakra-ui/issues/7107
  const { open, onOpen, onClose } = useDisclosure();
  const colorProps = colorScheme ? {} : { color: { _light: 'gray.400', _dark: 'gray.500' } };
  const iconName = icon || (type === 'link' ? 'link' : 'copy');

  // useEffect(() => {
  //   if (hasCopied) {
  //     setCopied(true);
  //   } else {
  //     setCopied(false);
  //   }
  // }, [ hasCopied ]);

  const handleClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    copy();
    onClick?.(event);
  }, [ onClick, copy ]);

  if (isLoading) {
    return <Skeleton boxSize={ size } className={ className } borderRadius="sm" flexShrink={ 0 } ml={ 2 } display="inline-block"/>;
  }

  return (
    <Tooltip
      content={ hasCopied ? 'Copied' : `Copy${ type === 'link' ? ' link ' : ' ' }to clipboard` }
      contentProps={{
        zIndex: 'tooltip2',
      }}
      // open={ hasCopied }
    >
      <IconButton
        { ...colorProps }
        aria-label="copy"
        boxSize={ size }
        colorScheme={ colorScheme }
        onClick={ handleClick }
        className={ className }
        // onMouseEnter={ onOpen }
        // onMouseLeave={ onClose }
        ml={ 2 }
        borderRadius="none"
      >
        <IconSvg name={ iconName } boxSize={ size }/>
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(chakra(CopyToClipboard));
