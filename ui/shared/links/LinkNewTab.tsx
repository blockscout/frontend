import { chakra, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from '../IconSvg';

interface Props {
  className?: string;
  label?: string;
  href: string;
}

const LinkNewTab = ({ className, label, href }: Props) => {
  const iconColor = useColorModeValue('gray.400', 'gray.500');

  return (
    <Tooltip label={ label }>
      <IconButton
        aria-label={ label ?? 'Open link' }
        icon={ <IconSvg name="open-link" boxSize={ 5 }/> }
        w="20px"
        h="20px"
        color={ iconColor }
        variant="simple"
        display="inline-block"
        flexShrink={ 0 }
        as="a"
        href={ href }
        target="_blank"
        className={ className }
        borderRadius={ 0 }
      />
    </Tooltip>
  );
};

export default React.memo(chakra(LinkNewTab));
