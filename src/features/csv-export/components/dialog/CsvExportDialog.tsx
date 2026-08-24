// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import { getLocalTimeZone, now, toCalendarDateTime, toTimeZone, toZoned } from '@internationalized/date';
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

  const { handleSubmit, formState, getValues, setValue } = formApi;

  // when the zone toggle flips, re-express the held wall-clock values in the new zone instant-preserving
  // (18:40 local → 16:40 UTC), so the toggle only changes how the picked moment is shown — never which
  // moment it is. Matches how the global "Local time format" setting re-expresses timestamps everywhere.
  const prevIsLocalTimeRef = React.useRef(isLocalTime);
  React.useEffect(() => {
    const prevIsLocalTime = prevIsLocalTimeRef.current;
    if (prevIsLocalTime === isLocalTime) {
      return;
    }
    prevIsLocalTimeRef.current = isLocalTime;

    const fromZone = prevIsLocalTime ? getLocalTimeZone() : 'UTC';
    const toZone = isLocalTime ? getLocalTimeZone() : 'UTC';

    ([ 'from_period', 'to_period' ] as const).forEach((name) => {
      const [ date ] = getValues(name) ?? [];
      // a date-only or already-zoned value carries no ambiguous wall-clock to re-express
      if (!date || !('hour' in date) || 'timeZone' in date) {
        return;
      }
      setValue(name, [ toCalendarDateTime(toTimeZone(toZoned(date, fromZone), toZone)) ], { shouldValidate: true });
    });
  }, [ isLocalTime, getValues, setValue ]);

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
