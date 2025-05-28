import { Button, Grid, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { FormFields } from 'ui/contractVerification/types';

import { useFetchStakersInfo } from 'lib/getStakersInfo';
import useToast from 'lib/hooks/useToast';
import { useStakingMethods } from 'lib/useStakingMethods';
import ContractVerificationFormRow from 'ui/contractVerification/ContractVerificationFormRow';
import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

const AddDelegationForm = () => {
  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: {
      validator_id: { label: '', value: '' }, // Update to match the expected type
      delegation_amount: 0,
    },
  });
  const { handleSubmit, watch, formState, setError, reset, clearErrors } = formApi;
  const toast = useToast();

  const { data: validatorsData } = useFetchStakersInfo();

  const options = validatorsData?.map(({ id, staker_name: stakerName }) => ({
    label: 'Validator ' + stakerName,
    value: String(id), // Ensure value is string for consistency
  }));

  // Staking methods hook
  const {
    delegate,
    isLoading,
    error: stakingError,
    success,
    clearMessages,
    isReady, // Check if wallet is connected and ready
  } = useStakingMethods();

  // Show toast notifications for staking operations
  React.useEffect(() => {
    if (stakingError) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: stakingError,
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ stakingError, toast ]);

  React.useEffect(() => {
    if (success) {
      toast({
        position: 'top-right',
        title: 'Success',
        description: `Transaction successful! Hash: ${ success }`,
        status: 'success',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ success, toast ]);

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {
    // Check if wallet is ready
    if (!isReady) {
      toast({
        position: 'top-right',
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to continue',
        status: 'warning',
        variant: 'subtle',
        isClosable: true,
      });
      return;
    }

    // @ts-ignore
    if (!data.validator_id?.value) {
      setError('validator_id', { message: 'Please select a validator' });
      return;
    }

    // @ts-ignore
    if (!data.delegation_amount || data.delegation_amount <= 0) {
      setError('delegation_amount', { message: 'Please enter a valid amount' });
      return;
    }

    try {
      // @ts-ignore
      const validatorId = parseInt(data.validator_id.value);

      // @ts-ignore
      const amount = String(data.delegation_amount);

      // Call delegate function
      const result = await delegate(validatorId, amount);

      if (result !== 'Transaction failed') {
        // Reset form on success
        reset();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during delegation:', error);
      setError('root', {
        message: 'Failed to delegate tokens. Please try again.',
      });
    }
  }, [ isReady, delegate, setError, reset, toast ]);

  const handleFormChange = React.useCallback(() => {
    clearErrors('root');
    clearMessages(); // Clear staking messages when form changes
  }, [ clearErrors, clearMessages ]);

  const selectedValidator = watch('validator_id');
  const delegationAmount = watch('delegation_amount');

  // Check if currently loading for the selected validator
  const isDelegating = selectedValidator?.value ?
    isLoading(parseInt(selectedValidator.value), 'delegate') :
    false;

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
            <FormFieldFancySelect<FormFields, 'validator_id'>
              name="validator_id"
              placeholder="Select Validator"
              isRequired
              options={ options }
              isDisabled={ !isReady || !options?.length }
            />

            <span>
              Delegation is the process of assigning your native tokens to a validator, allowing you to
              participate in the validation process and earn rewards. <br/> <br/> By delegating your
              tokens, you're supporting the network's security and stability, while also receiving a
              portion of the rewards generated by the validator.
            </span>
          </ContractVerificationFormRow>

          <ContractVerificationFormRow>
            <FormFieldText<FormFields, 'delegation_amount'>
              name="delegation_amount"
              isRequired
              placeholder="RWA Amount to delegate"
              type="number"
            />
          </ContractVerificationFormRow>

          { /* Display wallet connection status */ }
          { !isReady && (
            <ContractVerificationFormRow>
              <Text color="orange.500" fontSize="sm">
                ⚠️ Please connect your wallet to enable delegation
              </Text>
            </ContractVerificationFormRow>
          ) }

          { /* Display current staking error */ }
          { stakingError && (
            <ContractVerificationFormRow>
              <Text color="red.500" fontSize="sm">
                { stakingError }
              </Text>
            </ContractVerificationFormRow>
          ) }

          { /* Display success message */ }
          { success && (
            <ContractVerificationFormRow>
              <Text color="green.500" fontSize="sm">
                ✅ Transaction successful! Hash: { success }
              </Text>
            </ContractVerificationFormRow>
          ) }
        </Grid>

        { /* Display form validation errors */ }
        { formState.errors.root?.message && (
          <Text color="error" mt={ 4 } fontSize="sm" whiteSpace="pre-wrap">
            { formState.errors.root.message }
          </Text>
        ) }

        <Button
          variant="solid"
          size="lg"
          type="submit"
          mt={ 12 }
          isLoading={ formState.isSubmitting || isDelegating }
          loadingText={ isDelegating ? 'Delegating...' : 'Processing...' }
          isDisabled={ !isReady || !selectedValidator?.value || !delegationAmount }
        >
          Delegate to Validator
        </Button>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(AddDelegationForm);
