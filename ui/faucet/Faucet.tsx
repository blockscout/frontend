/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Flex,
  Box,
  Square,
  Text,
  Button,
  Input,
  Spacer,
  Heading,
  Highlight,
  FormControl,
  keyframes,
  AccordionItem,
  AccordionButton,
  Accordion,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { isAddress } from 'viem';

import { getEnvValue, sleep } from 'configs/app/utils';
import IconSvg from 'ui/shared/IconSvg';

const enum FAUCET_REQUEST_TYPE {
  REQUEST = 0,
  SENDING = 1,
  SENT = 2,
}

const Faucet = (props: { verified: boolean }) => {
  const { register, handleSubmit } = useForm<{ address: string }>();
  const [ isError, setIsError ] = React.useState<boolean>(false);
  const [ errMessage, setErrMessage ] = React.useState<string>('');
  const [ requestStatus, setRequestStatus ] = React.useState<number>(FAUCET_REQUEST_TYPE.REQUEST);

  const handleClk = React.useCallback(() => {
    if (props.verified) {
      return;
    } else {
      const redirectUri = `${ getEnvValue('NEXT_PUBLIC_API_PROTOCOL') }://${ getEnvValue('NEXT_PUBLIC_API_HOST') }/api/auth/callback/discord`;
      const authUrl = new URL('https://discord.com/oauth2/authorize');
      const searchParams = new URLSearchParams({
        client_id: getEnvValue('NEXT_PUBLIC_DISCORD_CLIENT_ID')!,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: 'identify guilds.join',
      });
      authUrl.search = searchParams.toString();
      location.href = authUrl.href;
    }
  }, [ props.verified ]);

  const reset = React.useCallback(() => {
    setIsError(false);
    setErrMessage('');
  }, []);

  const onSubmit = React.useCallback((data: { address: string }) => {
    if (!props.verified) {
      return;
    }

    if (!data.address) {
      if (!data.address) {
        setErrMessage('Please input a wallet address');
        setIsError(true);
      }
      return;
    } else {
      if (!isAddress(data.address)) {
        setIsError(true);
        setErrMessage('Invalid wallet address');
        return;
      }

      setRequestStatus(FAUCET_REQUEST_TYPE.SENDING);
      fetch('/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userWallet: data.address,
        }),
      })
        .then(async(res: any) => {
          if (res.ok) {
            reset();
            setRequestStatus(FAUCET_REQUEST_TYPE.SENT);
          } else {
            await sleep(500);
            setIsError(true);
            if (res.status === 429) {
              setErrMessage('The Discord account has already claimed test tokens within the last 24 hours. Please try again later.');
            }
            setRequestStatus(FAUCET_REQUEST_TYPE.REQUEST);
          }
        })
        .catch(() => {
          setIsError(true);
          setErrMessage('Something went wrong');
          setRequestStatus(FAUCET_REQUEST_TYPE.REQUEST);
        });
    }
  }, [ props.verified, reset ]);

  const verifyBtnStyles = React.useCallback(() => {
    if (props.verified) {
      return {
        bg: '#30D3BF',
        height: '48px',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        _hover: { background: '#30D3BF' },
        cursor: 'unset',
      };
    } else {
      return {
        bg: '#707CFF',
        height: '48px',
        border: '1px solid #3846DE',
        _hover: { background: '#707CFF' },
      };
    }
  }, [ props.verified ]);

  const requestBtnStyles = React.useCallback(() => {
    if (requestStatus === FAUCET_REQUEST_TYPE.REQUEST && props.verified) {
      return {
        border: '1px solid #8A55FD',
        bg: '#A07EFF',
        _hover: {
          bg: '#A07EFF',
        },
        boxShadow: '0px 2px 4px 0px rgba(255, 255, 255, 0.25)',
      };
    } else if (requestStatus === FAUCET_REQUEST_TYPE.SENDING || !props.verified) {
      return {
        border: '1px rgba(0, 0, 0, 0.12)',
        bg: '#A07EFF',
        opacity: 0.5,
        cursor: 'not-allowed',
        _hover: {
          bg: '#A07EFF',
        },
        boxShadow: '0px 2px 4px 0px rgba(255, 255, 255, 0.25)',
      };
    } else {
      return {
        border: '1px rgba(0, 0, 0, 0.12)',
        bg: '#30D3BF',
        _hover: {
          bg: '#30D3BF',
        },
        boxShadow: '0px 2px 4px 0px rgba(255, 255, 255, 0.25)',
      };
    }
  }, [ requestStatus, props.verified ]);

  const requestBtnContent = React.useCallback(() => {
    if (requestStatus === FAUCET_REQUEST_TYPE.REQUEST) {
      return <>Request</>;
    } else if (requestStatus === FAUCET_REQUEST_TYPE.SENDING) {
      const spin = keyframes`
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    `;

      return (
        <>
          <IconSvg name="loading" color="#FFF" w="24px" h="24px" mr="10px" animation={ `${ spin } 1s linear infinite` }/>
          Request
        </>
      );
    } else {
      return (
        <>
          <IconSvg name="check-circle" color="#FFF" w="24px" h="24px" mr="10px"/>
          Token Sent!
        </>
      );
    }
  }, [ requestStatus ]);

  return (
    <>
      <Heading fontSize="24px" fontWeight="400" lineHeight="28px">
        <Highlight
          query="$ZKME"
          styles={{ color: '#8A55FD', fontWeight: '700' }}
        >
          To receive $ZKME on MeChain Testnet, please follow the steps below.
        </Highlight>
      </Heading>
      <Text
        margin="16px 0 24px 0"
        fontSize="24px"
        fontWeight="400"
        lineHeight="28px"
      >
        Tokens will be automatically transferred to your address.
      </Text>
      <Flex>
        <Box
          width="580px"
          minH="280px"
          border="1px solid rgba(0, 0, 0, 0.06)"
          borderRadius="16px"
          bg="rgba(245, 242, 255, 0.32)"
          padding="24px"
        >
          <Box
            border="1px solid #3846DE"
            bg="#707CFF"
            borderRadius="50%"
            width="32px"
            height="32px"
            color="#FFFFFF"
            textAlign="center"
            lineHeight="32px"
          >
            1
          </Box>
          <Flex
            margin="24px 0 48px 0"
            alignItems="center"
            fontWeight="700"
            fontSize="24px"
            color="#000000"
          >
            <Text>Join our Discord</Text>
            <IconSvg
              name="social/discord_colored"
              w="38px"
              h="25px"
              margin="0px 8px"
            />
            <Text>Community</Text>
          </Flex>
          <Button
            { ...verifyBtnStyles() }
            borderRadius="100px"
            padding="12px 0"
            width="200px"
            onClick={ handleClk }
          >
            {
              props.verified ? <IconSvg name="shield" color="#FFF" w="24px" h="24px" mr="10px"/> : null
            }
            { props.verified ? 'Account Verified' : 'Verify' }
          </Button>
        </Box>
        <Square size="20px"></Square>
        <Box
          width="580px"
          minH="280px"
          border="1px solid rgba(0, 0, 0, 0.06)"
          borderRadius="16px"
          bg="rgba(245, 242, 255, 0.32)"
          padding="24px"
        >
          <Box
            border="1px solid #3846DE"
            bg="#707CFF"
            borderRadius="50%"
            width="32px"
            height="32px"
            color="#FFFFFF"
            textAlign="center"
            lineHeight="32px"
          >
            2
          </Box>
          <Flex
            margin="24px 0 48px 0"
            alignItems="center"
            fontWeight="700"
            fontSize="24px"
          >
            <Heading
              fontWeight="700"
              fontSize="24px"
              color="#000000"
              lineHeight="28px"
            >
              <Highlight query="$ZKME" styles={{ color: '#8A55FD' }}>
                Request $ZKME on MeChain
              </Highlight>
            </Heading>
            <IconSvg name="mechain_square" w="37px" h="25px"/>
            <Text fontWeight="700" color="#000000">
              Testnet
            </Text>
          </Flex>
          <form noValidate autoComplete="off" onSubmit={ handleSubmit(onSubmit) }>
            <FormControl>
              <Flex>
                <Input
                  width="300px"
                  height="48px"
                  fontWeight="700"
                  lineHeight="normal"
                  fontSize="14px"
                  placeholder="Enter address"
                  padding="12px 8px"
                  { ...register('address', {
                    onChange: () => {
                      reset();
                    },
                  }) }/>
                <Spacer/>
                <Button
                  { ...requestBtnStyles() }
                  height="48px"
                  borderRadius="100px"
                  padding="12px 0"
                  width="200px"
                  type="submit"
                >
                  { requestBtnContent() }
                </Button>
              </Flex>
              { isError && errMessage ?
                <Text color="#EE6969" w="290px" mt="6px" fontSize="11px" fontWeight="400" lineHeight="16px">{ errMessage }</Text> :
                null }
            </FormControl>
          </form>
        </Box>
      </Flex>
      <Flex
        marginTop="24px"
        maxW="1320px"
        minH="450px"
        flexDirection="column"
        gap="32px"
      >
        <Text
          fontSize="24px"
          fontWeight="700"
          lineHeight="28px"
        >
          FAQs
        </Text>
        <Accordion
          display="flex"
          flexDirection="column"
          gap="32px"
          allowMultiple
          defaultIndex={ [ 0 ] }
        >
          <AccordionItem
            border="none"
          >
            <AccordionButton
              padding="0px"
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'inherit',
                },
              }}
            >
              <Flex
                w="100%"
                justifyContent="space-between"
              >
                <Box as="span" textAlign="left" fontSize="14px" fontWeight="500">
                What is a testnet Mechain faucet?
                </Box>
                <AccordionIcon/>
              </Flex>
            </AccordionButton>
            <AccordionPanel fontSize="12px" fontWeight="400" maxWidth="800" lineHeight="16px" color="rgba(0, 0, 0, 0.60)" pl="0" pr="0" pb="0">
            A MeChain faucet is a developer tool designed to provide testnet $ZKME tokens, allowing developers to test and troubleshoot their decentralized
applications or protocols before deploying them on the MeChain mainnet where real $ZKME tokens are required. The MeChain testnet faucet is
designed to be developer-friendly, providing easy access to testnet tokens for integration and testing purposes.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem
            border="none">
            <AccordionButton
              padding="0px"
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'inherit',
                },
              }}
            >
              <Flex
                w="100%"
                justifyContent="space-between"
              >
                <Box as="span" textAlign="left" fontSize="14px" fontWeight="500">
                What is a testnet $ZKME token?
                </Box>
                <AccordionIcon/>
              </Flex>
            </AccordionButton>
            <AccordionPanel fontSize="12px" fontWeight="400" maxWidth="800" lineHeight="16px" color="rgba(0, 0, 0, 0.60)" pl="0" pr="0" pb="0">
            Testnet $ZKME tokens are a test version of the MeChain network&apos;s native token, allowing developers to simulate transactions and interactions
within the zkMe ecosystem without using real value. These tokens can be used in place of mainnet $ZKME tokens on the MeChaintestnet.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem
            border="none">
            <AccordionButton
              padding="0px"
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'inherit',
                },
              }}
            >
              <Flex
                w="100%"
                justifyContent="space-between"
              >
                <Box as="span" textAlign="left" fontSize="14px" fontWeight="500">
                How to request $ZKME?
                </Box>
                <AccordionIcon/>
              </Flex>
            </AccordionButton>
            <AccordionPanel fontSize="12px" fontWeight="400" maxWidth="800" lineHeight="16px" color="rgba(0, 0, 0, 0.60)" pl="0" pr="0" pb="0">
            First you need to join zkMe&apos;s discord community(https://discord.com/invite/SJ2RDs9NGM) and hit&ldquo;Verify&ldquo;.
            When the button changes to&ldquo;Account Verified&ldquo;, you can go to step 2.
            After entering the address and hit &ldquo;Request&ldquo;, we will send tokens to this address.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem
            border="none">
            <AccordionButton
              padding="0px"
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'inherit',
                },
              }}
            >
              <Flex
                w="100%"
                justifyContent="space-between"
              >
                <Box as="span" textAlign="left" fontSize="14px" fontWeight="500">
                Can I request more $ZKME?
                </Box>
                <AccordionIcon/>
              </Flex>
            </AccordionButton>
            <AccordionPanel fontSize="12px" fontWeight="400" maxWidth="800" lineHeight="16px" color="rgba(0, 0, 0, 0.60)" pl="0" pr="0" pb="0">
            You can only request $ZKME every 24h.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </>
  );
};

export default React.memo(Faucet);
