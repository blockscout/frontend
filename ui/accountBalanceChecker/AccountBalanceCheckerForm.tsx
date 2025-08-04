import { Button, Grid, Text, chakra, HStack, Box, VStack, Divider } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import { parseAbi } from 'viem';
import { usePublicClient } from 'wagmi';

import type { FormFieldsBalanceChecker } from 'ui/contractVerification/types';

import useToast from 'lib/hooks/useToast';
import ContractVerificationFormRow from 'ui/contractVerification/ContractVerificationFormRow';
import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

// ERC20 ABI for balanceOf function
const erc20Abi = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
]);

interface BalanceResult {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  balance: string;
  decimals: number;
  formattedBalance: string;
  blockNumber: string;
}

const AccountBalanceCheckerForm = () => {
  const formApi = useForm<FormFieldsBalanceChecker>({
    mode: 'onBlur',
    defaultValues: {
      address: '',
      method: { label: '', value: 'flattened-code' },
      license_type: null,
      cryptocurrency: { label: 'RWA', value: 'RWA' },
      account_address: '',
      filter_type: 'block',
      block_number: '',
      erc20_address: '',
    },
  });

  const { handleSubmit, watch, formState, setError, reset, clearErrors } = formApi;
  const toast = useToast();
  const publicClient = usePublicClient();

  // State for balance results
  const [ balanceResult, setBalanceResult ] = React.useState<BalanceResult | null>(null);
  const [ isLoading, setIsLoading ] = React.useState(false);

  // Cryptocurrency options
  const cryptoOptions = [
    { label: 'RWA', value: 'RWA' },
    { label: 'ERC20', value: 'ERC20' },
  ];

  const onFormSubmit: SubmitHandler<FormFieldsBalanceChecker> = React.useCallback(async(data) => {
    // Validate required fields
    if (!data.account_address) {
      setError('account_address', { message: 'Please enter an account address' });
      return;
    }

    if (!data.block_number) {
      setError('block_number', { message: 'Please enter a block number' });
      return;
    }

    if (data.cryptocurrency.value === 'ERC20' && !data.erc20_address) {
      setError('erc20_address', { message: 'Please enter ERC20 token address' });
      return;
    }

    if (!publicClient) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: 'Public client not available',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setBalanceResult(null);

    try {
      const accountAddress = data.account_address as `0x${ string }`;
      const selectedCrypto = data.cryptocurrency.value;
      const blockNumber = BigInt(data.block_number);

      // Handle native ETH vs ERC20 tokens
      if (selectedCrypto === 'RWA') {
        // For native ETH, we'll use getBalance instead of balanceOf
        const balance = await publicClient.getBalance({
          address: accountAddress,
          blockNumber,
        });

        setBalanceResult({
          tokenAddress: 'Native RWA',
          tokenSymbol: 'RWA',
          tokenName: 'RWA',
          balance: balance.toString(),
          decimals: 18,
          formattedBalance: (Number(balance) / 10 ** 18).toFixed(6),
          blockNumber: data.block_number,
        });
      } else if (selectedCrypto === 'ERC20') {
        // For ERC20 tokens
        const tokenAddress = data.erc20_address as `0x${ string }`;

        // Get token info
        const [ balance, decimals, symbol, name ] = await Promise.all([
          publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [ accountAddress ],
            blockNumber,
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'decimals',
            blockNumber,
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'symbol',
            blockNumber,
          }),
          publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'name',
            blockNumber,
          }),
        ]);

        setBalanceResult({
          tokenAddress: data.erc20_address,
          tokenSymbol: symbol,
          tokenName: name,
          balance: balance.toString(),
          decimals: Number(decimals),
          formattedBalance: (Number(balance) / 10 ** Number(decimals)).toFixed(6),
          blockNumber: data.block_number,
        });
      }

      toast({
        position: 'top-right',
        title: 'Balance Retrieved',
        description: `Successfully retrieved balance for ${ data.account_address }`,
        status: 'success',
        variant: 'subtle',
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to lookup balance',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [ setError, toast, publicClient ]);

  const handleFormChange = React.useCallback(() => {
    clearErrors('root');
  }, [ clearErrors ]);

  const handleReset = React.useCallback(() => {
    reset();
    setBalanceResult(null);
  }, [ reset ]);

  const selectedCrypto = watch('cryptocurrency');

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ handleSubmit(onFormSubmit) }
        onChange={ handleFormChange }
      >
        <Grid
          as="section"
          columnGap="30px"
          rowGap={{ base: 2, lg: 5 }}
          templateColumns={{ base: '1fr', lg: 'minmax(auto, 680px) minmax(0, 340px)' }}
        >
          <ContractVerificationFormRow>
            <FormFieldFancySelect<FormFieldsBalanceChecker, 'cryptocurrency'>
              name="cryptocurrency"
              placeholder="Choose an option"
              isRequired
              options={ cryptoOptions }
            />

            <span>
              Select the cryptocurrency for which you want to check the historical balance.
            </span>
          </ContractVerificationFormRow>

          { selectedCrypto?.value === 'ERC20' && (
            <ContractVerificationFormRow>
              <FormFieldText<FormFieldsBalanceChecker, 'erc20_address'>
                name="erc20_address"
                isRequired
                placeholder="0x..."
                type="text"
              />

              <span>
                Enter the ERC20 token contract address for which you want to check the balance.
              </span>
            </ContractVerificationFormRow>
          ) }

          <ContractVerificationFormRow>
            <FormFieldText<FormFieldsBalanceChecker, 'account_address'>
              name="account_address"
              isRequired
              placeholder="0x..."
              type="text"
            />

            <span>
              Enter the account or contract address for which you want to check the historical balance.
            </span>
          </ContractVerificationFormRow>

          <ContractVerificationFormRow>
            <FormFieldText<FormFieldsBalanceChecker, 'block_number'>
              name="block_number"
              isRequired
              placeholder="Enter block number"
              type="number"
            />

            <span>
              Enter the specific block number for the balance snapshot.
            </span>
          </ContractVerificationFormRow>

          { /* Display form validation errors */ }
          { formState.errors.root?.message && (
            <ContractVerificationFormRow>
              <Text color="red.500" fontSize="sm">
                { formState.errors.root.message }
              </Text>
            </ContractVerificationFormRow>
          ) }
        </Grid>

        <HStack spacing={ 4 } mt={ 12 }>
          <Button
            variant="solid"
            size="lg"
            type="submit"
            isLoading={ isLoading }
            loadingText="Looking up..."
            isDisabled={ !watch('account_address') || (selectedCrypto?.value === 'ERC20' && !watch('erc20_address')) }
          >
            Lookup
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={ handleReset }
            isDisabled={ isLoading }
          >
            Reset
          </Button>
        </HStack>

        { /* Display balance results */ }
        { balanceResult && (
          <VStack spacing={ 4 } mt={ 8 } p={ 6 } borderRadius="md" align="stretch">
            <Text fontSize="lg" fontWeight="bold">Balance Result</Text>
            <Divider/>
            <Grid templateColumns="1fr 1fr" gap={ 4 }>
              <Box>
                <Text fontWeight="medium" color="gray.600">Token:</Text>
                <Text>{ balanceResult.tokenName } ({ balanceResult.tokenSymbol })</Text>
              </Box>
              <Box>
                <Text fontWeight="medium" color="gray.600">Token Address:</Text>
                <Text fontFamily="mono" fontSize="sm">{ balanceResult.tokenAddress }</Text>
              </Box>
              <Box>
                <Text fontWeight="medium" color="gray.600">Balance:</Text>
                <Text fontSize="lg" fontWeight="bold">{ balanceResult.formattedBalance } { balanceResult.tokenSymbol }</Text>
              </Box>
              <Box>
                <Text fontWeight="medium" color="gray.600">Raw Balance:</Text>
                <Text fontFamily="mono" fontSize="sm">{ balanceResult.balance }</Text>
              </Box>
              <Box>
                <Text fontWeight="medium" color="gray.600">Block Number:</Text>
                <Text>{ balanceResult.blockNumber }</Text>
              </Box>
            </Grid>
          </VStack>
        ) }
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(AccountBalanceCheckerForm);
