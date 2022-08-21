import {
  Button,
  Box,
  Grid,
  GridItem,
  Text,
  HStack,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { Path } from 'react-hook-form';
import { useForm, useFieldArray } from 'react-hook-form';

import type { TPublicTagItem, TPublicTag, TPublicTagAddress } from 'data/publicTags';
import { EMAIL_REGEXP } from 'lib/validations/email';

import PublicTagFormAction from './PublicTagFormAction';
import PublicTagFormAddressInput from './PublicTagFormAddressInput';
import PublicTagFormComment from './PublicTagFormComment';
import PublicTagsFormInput from './PublicTagsFormInput';

type Props = {
  changeToDataScreen: (success?: boolean) => void;
  data?: TPublicTagItem;
}

export type Inputs = {
  userName: string;
  userEmail: string;
  companyName: string;
  companyUrl: string;
  action: 'add' | 'report';
  tag: string;
  addresses: Array<{
    name: string;
    address: string;
  }>;
  comment: string;
}

const placeholders = {
  userName: 'Your name',
  userEmail: 'Email',
  companyName: 'Company name',
  companyUrl: 'Company website',
  tag: 'Public tag (max 35 characters)',
  comment: 'Specify the reason for adding tags and color preference(s).',
} as Record<Path<Inputs>, string>;

const ADDRESS_INPUT_BUTTONS_WIDTH = 170;

const PublicTagsForm = ({ changeToDataScreen, data }: Props) => {
  const { control, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
      userName: data?.userName || '',
      userEmail: data?.userEmail || '',
      companyName: data?.companyName || '',
      companyUrl: data?.companyUrl || '',
      tag: data?.tags.map((tag: TPublicTag) => tag.name).join('; ') || '',
      addresses: data?.addresses.map((adr: TPublicTagAddress, index: number) => ({ name: `address.${ index }.address`, address: adr.address })) ||
        [ { name: 'address.0.address', address: '' } ],
      comment: data?.comment || '',
    },
    mode: 'all',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'addresses',
    control,
  });

  const onAddFieldClick = useCallback(() => append({ address: '' }), [ append ]);
  const onRemoveFieldClick = useCallback((index: number) => () => remove(index), [ remove ]);

  const changeToData = useCallback(() => {
    changeToDataScreen(true);
  }, [ changeToDataScreen ]);

  return (
    <Box width={ `calc(100% - ${ ADDRESS_INPUT_BUTTONS_WIDTH }px)` } maxWidth="844px">
      <Text size="sm" variant="secondary" paddingBottom={ 5 }>Company info</Text>
      <Grid templateColumns="1fr 1fr" rowGap={ 4 } columnGap={ 5 }>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="userName"
            control={ control }
            label={ placeholders.userName }
            required
          />
        </GridItem>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="companyName"
            control={ control }
            label={ placeholders.companyName }
          />
        </GridItem>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="userEmail"
            control={ control }
            label={ placeholders.userEmail }
            pattern={ EMAIL_REGEXP }
            hasError={ Boolean(errors.userEmail) }
            required
          />
        </GridItem>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="companyUrl"
            control={ control }
            label={ placeholders.companyUrl }
          />
        </GridItem>
      </Grid>
      <Box marginTop={ 4 } marginBottom={ 8 }>
        <PublicTagFormAction canReport={ Boolean(data) } control={ control }/>
      </Box>
      <Text size="sm" variant="secondary" marginBottom={ 5 }>Public tags (2 tags maximum, please use &quot;;&quot; as a divider)</Text>
      <Box marginBottom={ 4 }>
        <PublicTagsFormInput<Inputs>
          fieldName="tag"
          control={ control }
          label={ placeholders.tag }
          hasError={ Boolean(errors.tag) }
          required/>
      </Box>
      { fields.map((field, index) => {
        return (
          <Box position="relative" key={ field.id } marginBottom={ 4 }>
            <PublicTagFormAddressInput
              control={ control }
              hasError={ Boolean(errors?.addresses?.[index]) }
              index={ index }
              fieldsLength={ fields.length }
              onAddFieldClick={ onAddFieldClick }
              onRemoveFieldClick={ onRemoveFieldClick }
            />
          </Box>
        );
      }) }
      <Box marginBottom={ 8 }>
        <PublicTagFormComment control={ control }/>
      </Box>
      <HStack spacing={ 6 }>
        <Button
          size="lg"
          variant="primary"
          onClick={ handleSubmit(changeToData) }
          disabled={ Object.keys(errors).length > 0 }
        >
          Send request
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={ changeToData }
        >
          Cancel
        </Button>
      </HStack>
    </Box>
  );
};

export default PublicTagsForm;
