import {
  Box,
  Button,
  Checkbox,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { TWatchlistItem } from 'types/client/account';

import AddressInput from 'ui/shared/AddressInput';
import TagInput from 'ui/shared/TagInput';

const NOTIFICATIONS = [ 'native', 'ERC-20', 'ERC-721' ] as const;
const NOTIFICATIONS_NAMES = [ 'xDAI', 'ERC-20', 'ERC-721, ERC-1155 (NFT)' ];
const ADDRESS_LENGTH = 42;
const TAG_MAX_LENGTH = 35;

type Props = {
  data?: TWatchlistItem;
  onClose: () => void;
}

type Inputs = {
  address: string;
  tag: string;
  notification: boolean;
  notification_settings: {
    'native': {
      outcoming: boolean;
      incoming: boolean;
    };
    'ERC-721': {
      outcoming: boolean;
      incoming: boolean;
    };
    'ERC-20': {
      outcoming: boolean;
      incoming: boolean;
    };
  };
}

type Checkboxes = 'notification' |
'notification_settings.native.outcoming' |
'notification_settings.native.incoming' |
'notification_settings.ERC-20.outcoming' |
'notification_settings.ERC-20.incoming' |
'notification_settings.ERC-721.outcoming' |
'notification_settings.ERC-721.incoming';

// TODO: mb we need to create an abstract form here?

const AddressForm: React.FC<Props> = ({ data, onClose }) => {
  const [ pending, setPending ] = useState(false);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

  const queryClient = useQueryClient();

  const { mutate } = useMutation((formData: Inputs) => {

    let mutationFunction;
    const requestParams = {
      name: formData?.tag,
      address_hash: formData?.address,
      notification_settings: formData.notification_settings,
      notification_methods: {
        email: formData.notification,
      },
    };
    if (data) {
      // edit address
      mutationFunction = () => fetch(`/api/account/watchlist/${ data.id }`, { method: 'PUT', body: JSON.stringify(requestParams) });
    } else {
      // add address
      mutationFunction = () => fetch('/api/account/watchlist', { method: 'POST', body: JSON.stringify(requestParams) });
    }
    return mutationFunction();
  }, {
    onError: () => {
      // eslint-disable-next-line no-console
      console.log('error');
    },
    onSuccess: () => {
      queryClient.refetchQueries([ 'watchlist' ]).then(() => {
        onClose();
        setPending(false);
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    setPending(true);
    mutate(formData);
  };

  useEffect(() => {
    const notificationsDefault = {} as Inputs['notification_settings'];
    NOTIFICATIONS.forEach(n => notificationsDefault[n] = { incoming: true, outcoming: true });
    setValue('address', data?.address_hash || '');
    setValue('tag', data?.name || '');
    setValue('notification', data ? data.notification_methods.email : true);
    setValue('notification_settings', data ? data.notification_settings : notificationsDefault);
  }, [ setValue, data ]);

  const renderAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'address'>}) => {
    return <AddressInput<Inputs, 'address'> field={ field } isInvalid={ Boolean(errors.address) }/>;
  }, [ errors ]);

  const renderTagInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'tag'>}) => {
    return <TagInput field={ field } isInvalid={ Boolean(errors.tag) }/>;
  }, [ errors ]);

  // eslint-disable-next-line react/display-name
  const renderCheckbox = useCallback((text: string) => ({ field }: {field: ControllerRenderProps<Inputs, Checkboxes>}) => (
    <Checkbox
      isChecked={ field.value }
      onChange={ field.onChange }
      ref={ field.ref }
      colorScheme="blue"
      size="lg"
    >
      { text }
    </Checkbox>
  ), []);

  return (
    <>
      <Box marginBottom={ 5 }>
        <Controller
          name="address"
          control={ control }
          rules={{
            maxLength: ADDRESS_LENGTH,
            minLength: ADDRESS_LENGTH,
          }}
          render={ renderAddressInput }
        />
      </Box>
      <Box marginBottom={ 8 }>
        <Controller
          name="tag"
          control={ control }
          rules={{
            maxLength: TAG_MAX_LENGTH,
          }}
          render={ renderTagInput }
        />
      </Box>
      <Text variant="secondary" fontSize="sm" marginBottom={ 5 }>
        Please select what types of notifications you will receive
      </Text>
      <Box marginBottom={ 8 }>
        <Grid templateColumns="repeat(3, max-content)" gap="20px 24px">
          { NOTIFICATIONS.map((notification: string, index: number) => {
            const incomingFieldName = `notification_settings.${ notification }.incoming` as Checkboxes;
            const outgoingFieldName = `notification_settings.${ notification }.outcoming` as Checkboxes;
            return (
              <React.Fragment key={ notification }>
                <GridItem>{ NOTIFICATIONS_NAMES[index] }</GridItem>
                <GridItem>
                  <Controller
                    name={ incomingFieldName }
                    control={ control }

                    render={ renderCheckbox('Incoming') }
                  />
                </GridItem>
                <GridItem>
                  <Controller
                    name={ outgoingFieldName }
                    control={ control }

                    render={ renderCheckbox('Outgoing') }
                  />
                </GridItem>
              </React.Fragment>
            );
          }) }
        </Grid>
      </Box>
      <Text variant="secondary" fontSize="sm" marginBottom={ 5 }>Notification methods</Text>
      <Controller
        name={ 'notification' as Checkboxes }
        control={ control }
        render={ renderCheckbox('Email notifications') }
      />
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          variant="primary"
          onClick={ handleSubmit(onSubmit) }
          isLoading={ pending }
          disabled={ Object.keys(errors).length > 0 }
        >
          { data ? 'Save changes' : 'Add address' }
        </Button>
      </Box>
    </>
  );
};

export default AddressForm;
