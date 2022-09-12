import { Center, Icon, Link, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import tokeIcon from 'icons/tokens/toke.svg';
import usdtIcon from 'icons/tokens/usdt.svg';
import useLink from 'lib/link/useLink';

// temporary solution
// don't know where to get icons and addresses yet
const TOKENS = {
  USDT: {
    fullName: 'Tether USD',
    symbol: 'USDT',
    icon: usdtIcon,
    address: '0x9bD35A17C9C7c8820f89e0277e2046CDC57aCB15',
  },
  TOKE: {
    fullName: 'Tokemak',
    symbol: 'TOKE',
    icon: tokeIcon,
    address: '0x9bD35A17C9C7c8820f89e0277e2046CDC57aCB15',
  },
};

interface Props {
  symbol: string;
  className?: string;
}

const Token = ({ symbol, className }: Props) => {
  const token = TOKENS[symbol as keyof typeof TOKENS];
  const link = useLink();

  if (!token) {
    return null;
  }

  const url = link('token_index', { id: token.address });

  return (
    <Center className={ className }>
      <Icon as={ token.icon } boxSize={ 5 }/>
      <Link href={ url } target="_blank" ml={ 1 }>
        { token.fullName }
      </Link>
      <Text ml={ 1 }>({ token.symbol })</Text>
    </Center>
  );
};

export default chakra(Token);
