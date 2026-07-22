// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { DatePicker as ChakraDatePicker, HStack, Icon, Portal, useControllableState } from '@chakra-ui/react';
import { CalendarDateTime } from '@internationalized/date';
import React from 'react';

import dayjs from 'src/shared/date-and-time/dayjs';
import ArrowIcon from 'src/sprite/icons/arrows/east-mini.svg';
import CalendarIcon from 'src/sprite/icons/calendar.svg';

import { CloseButton } from './close-button';
import { Field } from './field';
import { InputGroup } from './input-group';
import { TimePicker } from './time-picker';

interface DatePickerValueChangeDetails {
  value: Array<DateValue>;
  valueAsString: Array<string>;
  view: 'day' | 'month' | 'year';
}

const format = (date: DateValue) => {
  return dayjs(date.toString()).format('MMM D, YYYY');
};

const formatWithTime = (date: DateValue) => {
  return dayjs(date.toString()).format('MMM D, YYYY H:mm');
};

const isToday = (date: DateValue): boolean => {
  const now = new Date();
  return date.year === now.getFullYear() && date.month === now.getMonth() && date.day === now.getDate();
};

const getTime = (date: DateValue): string => {
  return dayjs(date.toString()).format('H:mm');
};

const getDefaultDateValue = (isToday?: boolean): DateValue => {
  const now = new Date();
  return new CalendarDateTime(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    isToday ? now.getHours() : undefined,
    isToday ? now.getMinutes() : undefined,
  );
};

interface DatePickerProps extends ChakraDatePicker.RootProps {
  withTime?: boolean;
}

export const DatePicker = ({ placeholder, withTime, value: valueProp, defaultValue, onValueChange: onValueChangeProp, ...rest }: DatePickerProps) => {

  const onValueChange = React.useCallback((value: Array<DateValue> | undefined) => {
    onValueChangeProp?.({ value: value ?? [], valueAsString: value?.map(format) ?? [], view: 'day' });
  }, [ onValueChangeProp ]);

  const [ value, setValue ] = useControllableState<Array<DateValue> | undefined>({
    value: valueProp,
    defaultValue: defaultValue,
    onChange: onValueChange,
  });

  const handleDateChange = React.useCallback((details: DatePickerValueChangeDetails) => {
    const newDate = details.value[0];
    if (!newDate) return setValue([]);

    setValue((prev) => {
      const current = prev?.[0] ?? getDefaultDateValue(isToday(newDate));
      return [
        new CalendarDateTime(
          newDate.year,
          newDate.month,
          newDate.day,
          current && 'hour' in current ? current.hour : undefined,
          current && 'minute' in current ? current.minute : undefined,
        ),
      ];
    });
    // onValueChange?.({ value: details.value, valueAsString: details.valueAsString, view: 'day' });
  }, [ setValue ]);

  const handleTimeChange = React.useCallback((time: string) => {
    const [ hours, minutes ] = time.split(':');
    setValue((prev) => {
      const current = prev?.[0] ?? getDefaultDateValue();
      return [ current.set({ hour: Number(hours ?? '00'), minute: Number(minutes ?? '00') }) ];
    });
  }, [ setValue ]);

  const positioning = {
    placement: 'bottom-start' as const,
    overflowPadding: 4,
    sameWidth: true,
    ...rest.positioning,
    offset: {
      mainAxis: 4,
      ...rest.positioning?.offset,
    },
  };

  return (
    <ChakraDatePicker.Root
      openOnClick
      closeOnSelect
      lazyMount
      unmountOnExit
      format={ withTime ? formatWithTime : format }
      value={ value }
      onValueChange={ handleDateChange }
      { ...rest }
      positioning={ positioning }
    >
      <ChakraDatePicker.Control>
        <ChakraDatePicker.Context>
          { (context) => {
            const isFilled = context.value.length > 0;

            const endElement = (
              <HStack>
                { isFilled && (
                  <ChakraDatePicker.ClearTrigger asChild>
                    <CloseButton/>
                  </ChakraDatePicker.ClearTrigger>
                ) }
                <ChakraDatePicker.Trigger>
                  <Icon boxSize={ 6 }><CalendarIcon/></Icon>
                </ChakraDatePicker.Trigger>
              </HStack>
            );

            return (
              <Field
                label={ placeholder ?? 'Date' }
                floating
                size="lg"
              >
                <InputGroup endElement={ endElement } endElementProps={{ pl: 2, pr: 4 }}>
                  { /* TODO @tom2drum implement fix on blur or enable default one */ }
                  <ChakraDatePicker.Input fixOnBlur={ false }/>
                </InputGroup>
              </Field>
            );
          } }
        </ChakraDatePicker.Context>
      </ChakraDatePicker.Control>
      <Portal>
        <ChakraDatePicker.Positioner>
          <ChakraDatePicker.Content>
            { [ 'day' as const, 'month' as const, 'year' as const ].map((view) => (
              <ChakraDatePicker.View key={ view } view={ view }>
                <ChakraDatePicker.ViewControl>
                  <ChakraDatePicker.PrevTrigger>
                    <Icon boxSize={ 6 }><ArrowIcon/></Icon>
                  </ChakraDatePicker.PrevTrigger>
                  <ChakraDatePicker.ViewTrigger>
                    <ChakraDatePicker.RangeText/>
                  </ChakraDatePicker.ViewTrigger>
                  <ChakraDatePicker.NextTrigger>
                    <Icon boxSize={ 6 } transform="rotate(180deg)"><ArrowIcon/></Icon>
                  </ChakraDatePicker.NextTrigger>
                </ChakraDatePicker.ViewControl>
                { view === 'day' && (
                  <>
                    <ChakraDatePicker.DayTable/>
                    { withTime && (
                      <TimePicker
                        bgColor="dialog.bg"
                        value={ value?.[0] ? getTime(value?.[0]) : '00:00' }
                        onChange={ handleTimeChange }
                        mt={ -2 }
                      />
                    ) }
                  </>
                ) }
                { view === 'month' && <ChakraDatePicker.MonthTable/> }
                { view === 'year' && <ChakraDatePicker.YearTable/> }
              </ChakraDatePicker.View>
            )) }
          </ChakraDatePicker.Content>
        </ChakraDatePicker.Positioner>
      </Portal>
    </ChakraDatePicker.Root>
  );
};
