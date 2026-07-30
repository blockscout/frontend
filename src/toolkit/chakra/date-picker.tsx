// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { DatePicker as ChakraDatePicker, HStack, Icon, Portal, useControllableState } from '@chakra-ui/react';
import { CalendarDate, CalendarDateTime, getLocalTimeZone, isSameDay, now, toCalendarDateTime, today } from '@internationalized/date';
import dayjs from 'dayjs';
import { padStart } from 'es-toolkit/compat';
import React from 'react';

import ArrowIcon from 'src/sprite/icons/arrows/east-mini.svg';
import CalendarIcon from 'src/sprite/icons/calendar.svg';

import { CloseButton } from './close-button';
import { Field } from './field';
import { InputGroup } from './input-group';
import { TimePicker } from './time-picker';

export interface DatePickerValueChangeDetails {
  value: Array<DateValue>;
  valueAsString: Array<string>;
  view: 'day' | 'month' | 'year';
}

const DATE_FORMAT = 'MMM D, YYYY';
const DATE_TIME_FORMAT = 'MMM D, YYYY H:mm';

// a ZonedDateTime stringifies with an IANA suffix ("...+02:00[Europe/Madrid]") that dayjs cannot parse,
// so every value is narrowed to a plain calendar date-time before formatting
const toDayjs = (date: DateValue) => dayjs(toCalendarDateTime(date).toString());

const format = (date: DateValue) => {
  return toDayjs(date).format(DATE_FORMAT);
};

const formatWithTime = (date: DateValue) => {
  return toDayjs(date).format(DATE_TIME_FORMAT);
};

const parse = (value: string): DateValue | undefined => {
  const parsed = dayjs(value);
  if (!parsed.isValid()) return;

  return new CalendarDate(parsed.year(), parsed.month() + 1, parsed.date());
};

const parseWithTime = (value: string): DateValue | undefined => {
  const parsed = dayjs(value);
  if (!parsed.isValid()) return;

  return new CalendarDateTime(
    parsed.year(),
    parsed.month() + 1,
    parsed.date(),
    parsed.hour(),
    parsed.minute(),
  );
};

const getTimeParts = (date: DateValue | undefined) => {
  if (!date || !('hour' in date)) return { hour: undefined, minute: undefined };
  return { hour: date.hour, minute: date.minute };
};

const isToday = (date: DateValue): boolean => {
  return isSameDay(date, today(getLocalTimeZone()));
};

const getTime = (date: DateValue): string => {
  return toDayjs(date).format('H:mm');
};

const getDefaultDateValue = (withCurrentTime?: boolean): CalendarDateTime => {
  const current = now(getLocalTimeZone());
  return new CalendarDateTime(
    current.year,
    current.month,
    current.day,
    withCurrentTime ? current.hour : 0,
    withCurrentTime ? current.minute : 0,
  );
};

export interface DatePickerProps extends ChakraDatePicker.RootProps {
  withTime?: boolean;
  errorText?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  function Radio({
    placeholder,
    withTime,
    value: valueProp,
    defaultValue,
    onValueChange: onValueChangeProp,
    min,
    max,
    disabled,
    readOnly,
    invalid,
    errorText,
    required,
    bgColor,
    ...rest
  }, ref) {

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

      // without a time picker there is no time to carry over, so the value stays a plain calendar date
      if (!withTime) {
        return setValue([ new CalendarDate(newDate.year, newDate.month, newDate.day) ]);
      }

      setValue((prev) => {
        const current = prev?.[0] ?? getDefaultDateValue(isToday(newDate));
        const fromNew = getTimeParts(newDate);
        const fromCurrent = getTimeParts(current);
        const hour = fromNew.hour ?? fromCurrent.hour;
        const minute = fromNew.minute ?? fromCurrent.minute;

        return [ new CalendarDateTime(newDate.year, newDate.month, newDate.day, hour, minute) ];
      });
    }, [ setValue, withTime ]);

    const handleTimeChange = React.useCallback((time: string | undefined) => {
      const [ hours, minutes ] = time?.split(':') ?? [];
      setValue((prev) => {
        // a date-only value would silently ignore the time fields, so it is widened first
        const current = toCalendarDateTime(prev?.[0] ?? getDefaultDateValue());
        return [ current.set({ hour: Number(hours ?? 0), minute: Number(minutes ?? 0) }) ];
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
        ref={ ref }
        openOnClick
        closeOnSelect={ !withTime }
        lazyMount
        unmountOnExit
        format={ withTime ? formatWithTime : format }
        parse={ withTime ? parseWithTime : parse }
        value={ value }
        onValueChange={ handleDateChange }
        min={ min }
        max={ max }
        disabled={ disabled }
        invalid={ invalid }
        required={ required }
        { ...rest }
        positioning={ positioning }
      >
        <ChakraDatePicker.Control>
          <ChakraDatePicker.Context>
            { (context) => {
              const isFilled = context.value.length > 0;

              const endElement = (
                <HStack>
                  { isFilled && !readOnly && (
                    <ChakraDatePicker.ClearTrigger asChild disabled={ disabled }>
                      <CloseButton/>
                    </ChakraDatePicker.ClearTrigger>
                  ) }
                  <ChakraDatePicker.Trigger
                    disabled={ disabled }
                    { ...(readOnly ? { 'data-readOnly': true } : {}) }
                  >
                    <Icon boxSize={ 6 }><CalendarIcon/></Icon>
                  </ChakraDatePicker.Trigger>
                </HStack>
              );

              return (
                <Field
                  label={ placeholder ?? 'Date' }
                  floating
                  size="lg"
                  readOnly={ readOnly }
                  invalid={ invalid }
                  errorText={ errorText }
                  required={ required }
                  focusVisible={ context.open }
                  bgColor={ bgColor }
                >
                  <InputGroup endElement={ endElement } endElementProps={{ pl: 2, pr: 4 }}>
                    <ChakraDatePicker.Input/>
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
                      { withTime && (() => {

                        const minTime = min && 'hour' in min ?
                          `${ padStart(min.hour.toString(), 2, '0') }:${ padStart(min.minute.toString(), 2, '0') }` :
                          undefined;

                        const maxTime = max && 'hour' in max ?
                          `${ padStart(max.hour.toString(), 2, '0') }:${ padStart(max.minute.toString(), 2, '0') }` :
                          undefined;

                        const currentDate = value?.[0];
                        const isMinDay = currentDate && min && currentDate.year === min.year && currentDate.month === min.month && currentDate.day === min.day;
                        const isMaxDay = currentDate && max && currentDate.year === max.year && currentDate.month === max.month && currentDate.day === max.day;

                        return (
                          <TimePicker
                            value={ currentDate ? getTime(currentDate) : undefined }
                            min={ isMinDay ? minTime : undefined }
                            max={ isMaxDay ? maxTime : undefined }
                            onValueChange={ handleTimeChange }
                            disabled={ !currentDate }
                            inputProps={{ bgColor: 'dialog.bg' }}
                          />
                        );
                      })() }
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
  });
