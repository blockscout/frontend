import { Center, Icon, Link } from '@chakra-ui/react';
import React from 'react';

type Props = {
  icon?: React.FC<React.SVGAttributes<SVGElement>>;
  iconSize?: string;
  text: string;
  url: string;
}

const FooterLinkItem = ({ icon, iconSize, text, url }: Props) => {
  return (
    <Link href={ url } display="flex" alignItems="center" h="30px" variant="secondary" target="_blank" fontSize="xs">
      { icon && (
        <Center minW={ 6 } mr={ 2 }>
          <Icon boxSize={ iconSize || 5 } as={ icon }/>
        </Center>
      ) }
      { text }
    </Link>
  );
};

export default FooterLinkItem;
