// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import { getLocalTimeZone, now, toCalendarDateTime } from '@internationalized/date';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import type { FormFields } from './types';

import { useSettingsContext } from 'src/shell/top-bar/settings/context';
import SettingsLocalTime from 'src/shell/top-bar/settings/time-format/SettingsLocalTime';

import { Button } from 'src/toolkit/chakra/button';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'src/toolkit/chakra/dialog';
import type { OnOpenChangeHandler } from 'src/toolkit/hooks/useDisclosure';

import CsvExportFormDateField from './CsvExportFormDateField';

interface Props {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: OnOpenChangeHandler;
  onFormSubmit: (data: FormFields) => Promise<void>;
  onCancel: () => void;
  isAsyncDownload?: boolean;
}

const CsvExportDialog = ({ open, onOpenChange, onFormSubmit, onCancel, children, isAsyncDownload }: Props) => {
  const settings = useSettingsContext();
  const isLocalTime = settings?.isLocalTime ?? true;

  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: (() => {
      // the picker holds bare wall-clock values; seed them with "now" read in the zone the toggle
      // currently selects, truncated to whole minutes to match what the picker can express
      const currentWallClock = toCalendarDateTime(now(isLocalTime ? getLocalTimeZone() : 'UTC')).set({ second: 0, millisecond: 0 });
      return {
        from_period: [ currentWallClock.subtract({ days: 1 }) ],
        to_period: [ currentWallClock ],
      };
    })(),
  });

  const { handleSubmit, formState } = formApi;

  const handleOpenChange: OnOpenChangeHandler = React.useCallback(({ open }) => {
    if (formState.isSubmitting && !open) {
      const confirm = window.confirm('Are you sure you want to close the dialog? The export will be cancelled.');
      if (!confirm) {
        return;
      }
      onCancel();
    }
    onOpenChange({ open });
  }, [ onOpenChange, formState.isSubmitting, onCancel ]);

  return (
    <DialogRoot open={ open } onOpenChange={ handleOpenChange } size={{ lgDown: 'full', lg: 'sm' }}>
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
              <SettingsLocalTime id="csv-export-local-time" mt={ 6 } width="calc(100% - 1px)"/>
              <Flex
                rowGap={ 3 }
                mt={ 3 }
                flexDir="column"
                alignItems="stretch"
              >
                <CsvExportFormDateField name="from_period" formApi={ formApi } isLocalTime={ isLocalTime }/>
                <CsvExportFormDateField name="to_period" formApi={ formApi } isLocalTime={ isLocalTime }/>
              </Flex>
              <Button
                variant="solid"
                type="submit"
                mt={ 6 }
                loading={ formState.isSubmitting }
                disabled={ Boolean(formState.errors.from_period || formState.errors.to_period) }
              >
                { isAsyncDownload ? 'Generate CSV' : 'Download' }
              </Button>
            </DialogBody>
          </chakra.form>
        </FormProvider>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(CsvExportDialog);
