import { Box, Center, Flex, Icon, Link, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import NFTIcon from 'icons/nft_shield.svg';
import link from 'lib/link/link';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = AddressTokenBalance;

const NFTItem = ({ token, token_id: tokenId }: Props) => {
  const tokenLink = link('token_index', { hash: token.address });
  const router = useRouter();

  const onItemClick = React.useCallback(() => {
    router.push(tokenLink);
  }, [ router, tokenLink ]);

  return (
    <Box
      w="210px"
      h="272px"
      border="1px solid"
      borderColor="blackAlpha.100"
      borderRadius="12px"
      p="10px"
      _hover={{ boxShadow: 'md' }}
      fontSize="sm"
      fontWeight={ 500 }
      lineHeight="20px"
      onClick={ onItemClick }
      cursor="pointer"
    >
      <Center w="182px" h="182px" bg="blackAlpha.50" mb="18px" borderRadius="12px">
        <Icon as={ NFTIcon } boxSize="112px" color="blackAlpha.500"/>
      </Center>
      { tokenId && (
        <Flex mb={ 2 } ml={ 1 }>
          <Text whiteSpace="pre" variant="secondary">ID# </Text>
          <Link>{ tokenId }</Link>
        </Flex>
      ) }
      { token.name && (
        <Flex>
          <TokenLogo hash={ token.address } name={ token.name } boxSize={ 6 } ml={ 1 } mr={ 1 }/>
          <Text variant="secondary">{ token.name || 'aaaaa' }</Text>
        </Flex>
      ) }
    </Box>
  );
};

export default NFTItem;
