import { Center } from '@chakra-ui/react';
import React from 'react';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  icon?: IconName;
  iconSize?: string;
  text: string;
  url: string;
  isLoading?: boolean;
};

const FooterLinkItem = ({ icon, iconSize, text, url, isLoading }: Props) => {
  if (isLoading) {
    return <Skeleton loading my="3px">{ text }</Skeleton>;
  }

  return (
    <Link href={ url } display="flex" alignItems="center" h="30px" variant="subtle" target="_blank" textStyle="xs">
      { icon && (
        <Center minW={ 6 } mr={ 2 }>
          <IconSvg boxSize={ iconSize || 5 } name={ icon }/>
        </Center>
      ) }
      { text }
    </Link>
  );
};

export default FooterLinkItem;
