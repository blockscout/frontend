import { Center, Text, Icon, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type Props = {
  icon?: React.FC<React.SVGAttributes<SVGElement>>;
  iconSize?: string;
  text: string;
  url: string;
}

const FooterLinkItem = ({ icon, iconSize, text, url }: Props) => {
  const textColor = useColorModeValue('gray.600', 'gray.500');

  return (
    <Link href={ url } display="flex" alignItems="center" h={ 6 } color={ textColor }>
      { icon && (
        <Center minW={ 6 } mr="6px">
          <Icon boxSize={ iconSize || 5 } as={ icon }/>
        </Center>
      ) }
      <Text fontSize="xs" color={ textColor }>{ text }</Text>
    </Link>
  );
};

export default FooterLinkItem;
