/* eslint-disable */
import { Box, Flex, Text } from '@chakra-ui/react';
import { PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, type ButtonProps } from '@chakra-ui/react';
import React from 'react';
import { Button } from '@chakra-ui/react';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import useWeb3Wallet from 'lib/web3/useWallet';
import Popover from 'ui/shared/chakra/Popover';
import UserWalletButton from 'ui/snippets/user/wallet/UserWalletButton';
import UserWalletMenuContent from 'ui/snippets/user/wallet/UserWalletMenuContent';


const no_op = () => {};

const PlainButton = ({text,  onClick,  disabled = false , width = '72px'}: {
    text: string,
    onClick?: () => void,
    disabled?: boolean
    width?: string,
}) => {
    return (
        <Button
            onClick={ onClick || no_op }
            py = "4px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ backgroundColor: "#FFCBEC" , opacity: 0.9 }}
            width={ width }
            minWidth={ '100px' }
            height={ '32px' }
            variant='solid'
            flexShrink={ 0 }
            padding = { '0 16px' }
            backgroundColor = { disabled ? '#FFCBEC' : '#FF57B7' }
            cursor={ disabled ? 'not-allowed' : 'pointer' }
            borderRadius={9999}
        >
            <Text 
                fontSize="12px"
                fontWeight="400"
                lineHeight="normal"
                color = {'white' }
                fontFamily="HarmonyOS Sans"
            >{ text }</Text>
        </Button>
    );
}




const EmptyPlaceholder = ({
    tipsTextArray = [],
    showButton = false,
    buttonText = '',
    buttonOnClick = () => {},
}: {
    tipsTextArray?: string[];
    showButton?: boolean | string;
    buttonText?: string;
    buttonOnClick?: () => void;
}) => {
    const walletMenu = useDisclosure();

    const web3Wallet = useWeb3Wallet({ source: 'Header' });
    const web3AccountWithDomain = useWeb3AccountWithDomain(web3Wallet.isConnected);
    const { isAutoConnectDisabled } = useMarketplaceContext();

    const isPending =
        (web3Wallet.isConnected && web3AccountWithDomain.isLoading) ||
        (!web3Wallet.isConnected && web3Wallet.isOpen);

    const handleOpenWalletClick = React.useCallback(() => {
        web3Wallet.openModal();
        walletMenu.onClose();
    }, [ web3Wallet, walletMenu ]);

    const handleDisconnectClick = React.useCallback(() => {
        web3Wallet.disconnect();
        walletMenu.onClose();
    }, [ web3Wallet, walletMenu ]);

      const handleConnectWalletClick = React.useCallback(() => {
        console.log('handleConnectWalletClick');
        web3Wallet.openModal
      }, [ walletMenu ]);
    
    return (
        <Box
            width="100%"
            height="auto"
        >
            <Flex
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                userSelect="none"
            >
                <div  style={{
                        paddingTop: '11px',
                        paddingBottom: '10.68px',
                        userSelect: 'none',
                    }}
                >
                    <img 
                        draggable="false"
                        width="93px"
                        height="78.3px"
                        src="/static/NotDate.png"/>        
                </div>

                <div style={{
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: 'auto',
                    height: 'auto',
                    marginBottom: '16px',
                    marginTop: '16px',
                }}>
                    
                    { tipsTextArray.map((text, index) => (
                        <span
                            style={{
                                color: 'rgba(0, 0, 0, 0.40)',
                                textAlign: 'center',
                                fontFamily: 'HarmonyOS Sans',
                                fontSize: '14px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '16px',
                            }}
                        >
                            {text}
                        </span>
                    ))}
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: 'auto',
                    height: 'auto',
                    alignItems: 'center',
                }}>
                    { showButton === true  && 
                        <PlainButton
                            text={ buttonText }
                            onClick={ buttonOnClick }
                            width = 'auto'
                        />
                    }
                    {
                        showButton === "connect" &&
                                <Popover openDelay={ 300 } placement="bottom-end" isLazy isOpen={ walletMenu.isOpen } onClose={ walletMenu.onClose }>
                                <PopoverTrigger>
                                        <PlainButton
                                            text={ "Connect Wallet" }
                                            onClick={ web3Wallet.isConnected ? walletMenu.onOpen : web3Wallet.openModal }
                                            width = 'auto'
                                        />
                                </PopoverTrigger>
                                { web3AccountWithDomain.address && (
                                    <PopoverContent w="235px">
                                    <PopoverBody>
                                        <UserWalletMenuContent
                                        address={ web3AccountWithDomain.address }
                                        domain={ web3AccountWithDomain.domain }
                                        isAutoConnectDisabled={ isAutoConnectDisabled }
                                        isReconnecting={ web3Wallet.isReconnecting }
                                        onOpenWallet={ handleOpenWalletClick }
                                        onDisconnect={ handleDisconnectClick }
                                        />
                                    </PopoverBody>
                                    </PopoverContent>
                                ) }
                                </Popover>
                    }   
                </div>
            </Flex>
        </Box>
    );
}
export default EmptyPlaceholder;