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
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import IconSvg from 'ui/shared/IconSvg';

const Faucet = (props: { verified: boolean }) => {
  const { register, handleSubmit } = useForm<{ address: string }>();
  const [ isError, setIsError ] = React.useState<boolean>(false);
  const [ errMessage, setErrMessage ] = React.useState<string>('');

  const handleClk = React.useCallback(() => {
    if (props.verified) {
      return;
    } else {
      location.href =
        `https://discord.com/oauth2/authorize?client_id
        =1270924159391760487&response_type=code&redirect_uri
        =http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord&scope=identify+guilds.join`;
    }
  }, [ props.verified ]);

  const reset = React.useCallback(() => {
    setIsError(false);
    setErrMessage('');
  }, []);

  const onSubmit = React.useCallback((data: { address: string }) => {
    if (!props.verified) {
      return;
    } else {
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
          } else {
            setIsError(true);
            if (res.status === 429) {
              setErrMessage('The Discord account has already claimed test tokens within the last 24 hours. Please try again later.');
            }
          }
        })
        .catch(() => {
          setIsError(true);
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
                  bg="#A07EFF"
                  height="48px"
                  border="1px solid #8A55FD"
                  _hover={{ background: '#A07EFF' }}
                  borderRadius="100px"
                  padding="12px 0"
                  width="200px"
                  type="submit"
                >
              Request
                </Button>
              </Flex>
              { isError && errMessage ?
                <Text color="#EE6969" w="290px" mt="6px" fontSize="11px" fontWeight="400" lineHeight="16px">{ errMessage }</Text> :
                null }
            </FormControl>
          </form>
        </Box>
      </Flex>
      <Box
        marginTop="24px"
        width="580px"
        border="1px solid rgba(0, 0, 0, 0.06)"
        borderRadius="16px"
        padding="24px"
      >
        Detail
      </Box>
    </>
  );
};

export default React.memo(Faucet);
