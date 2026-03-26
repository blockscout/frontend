import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { FormFields } from './types';

import dayjs from 'lib/date/dayjs';
import { Button } from 'toolkit/chakra/button';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import type { OnOpenChangeHandler } from 'toolkit/hooks/useDisclosure';

import CsvExportFormDateField from './CsvExportFormDateField';

interface Props {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: OnOpenChangeHandler;
  onFormSubmit: (data: FormFields) => Promise<void>;
  onCancel: () => void;
}

const CsvExportDialog = ({ open, onOpenChange, onFormSubmit, onCancel, children }: Props) => {
  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: {
      from_period: dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm'),
      to_period: dayjs().format('YYYY-MM-DDTHH:mm'),
    },
  });

  const { handleSubmit, formState } = formApi;

  const handleOpenChange: OnOpenChangeHandler = React.useCallback(({ open }) => {
    if (formState.isSubmitting && !open) {
      const confirm = window.confirm('Are you sure you want to close the dialog? The export will be cancelled.');
      if (!confirm) {
        onCancel();
        return;
      }
    }
    onOpenChange({ open });
  }, [ onOpenChange, formState.isSubmitting, onCancel ]);

  return (
    <DialogRoot open={ open } onOpenChange={ handleOpenChange } size={{ lgDown: 'full', lg: 'md' }}>
      <DialogContent>
        <FormProvider { ...formApi }>
          <chakra.form
            noValidate
            onSubmit={ handleSubmit(onFormSubmit) }
          >
            <DialogHeader>
              Export data to CSV file
            </DialogHeader>
            <DialogBody>
              { children }
              <Flex
                columnGap={ 3 }
                rowGap={ 3 }
                mt={ 6 }
                flexDir={{ base: 'column', lg: 'row' }}
                alignItems={{ base: 'flex-start', lg: 'center' }}
                w="100%"
              >
                <CsvExportFormDateField name="from_period" formApi={ formApi }/>
                <CsvExportFormDateField name="to_period" formApi={ formApi }/>
              </Flex>
              <Button
                variant="solid"
                type="submit"
                mt={ 6 }
                loading={ formState.isSubmitting }
                disabled={ Boolean(formState.errors.from_period || formState.errors.to_period) }
              >
                Download
              </Button>
            </DialogBody>
          </chakra.form>
        </FormProvider>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(CsvExportDialog);
