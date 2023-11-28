import { Flex, useColorModeValue } from '@chakra-ui/react';
import React, { useCallback } from 'react';

export interface WalletButtonProps<T> {
  logo: React.ReactNode;
  title: string;
  wallet: T;
  onSelectWallet: (w: T) => void;
}

export const WalletButton = <T extends NonNullable<unknown>>({
  logo, title, wallet, onSelectWallet,
}: WalletButtonProps<T>) => {

  const onClick = useCallback(() => {
    onSelectWallet(wallet);
  }, [ onSelectWallet, wallet ]);

  const hoverBgColor = useColorModeValue('gray.100', 'gray.800');

  return (
    <Flex
      alignItems="center"
      borderRadius={ 10 }
      flexDirection="column"
      justifyContent="flex-start"
      flexBasis="94px"
      marginBottom="12px"
      width="94px"
      py={ 2 }
      px={ 2 }
      onClick={ onClick }
      _hover={{
        cursor: 'pointer',
        backgroundColor: hoverBgColor,
      }}
    >
      <Flex
        alignItems="center"
        bg={ hoverBgColor }
        borderRadius={ 12 }
        display="flex"
        flexDirection="row"
        height="48px"
        justifyContent="center"
        marginBottom="8px"
        padding="8px"
        width="48px"
      >
        <Flex
          alignItems="center"
          display="flex"
          flexDirection="row"
          height="32px"
          justifyContent="center"
          width="32px"
        >{ logo }</Flex>
      </Flex>
      <Flex
        fontSize={ 12 }
        fontStyle="normal"
        fontWeight={ 300 }
        lineHeight="16px"
        textAlign="center"
      >{ title }</Flex>
    </Flex>
  );
};
