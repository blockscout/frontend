import { Flex, Text } from '@chakra-ui/react';
import { isEqual } from 'es-toolkit';
import type { ChangeEvent } from 'react';
import React from 'react';

import { ADVANCED_FILTER_AGES, type AdvancedFilterAge, type AdvancedFilterParams } from 'types/api/advancedFilter';

import dayjs from 'lib/date/dayjs';
import { Input } from 'toolkit/chakra/input';
import { PopoverCloseTriggerWrapper } from 'toolkit/chakra/popover';
import { ndash } from 'toolkit/utils/htmlEntities';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';
import TagGroupSelect from 'ui/shared/tagGroupSelect/TagGroupSelect';

import { getDurationFromAge } from '../lib';

const FILTER_PARAM_FROM = 'age_from';
const FILTER_PARAM_TO = 'age_to';
const FILTER_PARAM_AGE = 'age';

const defaultValue = { age: '', from: '', to: '' } as const;
type AgeFromToValue = { age: AdvancedFilterAge | ''; from: string; to: string };

type Props = {
  value?: AgeFromToValue;
  handleFilterChange: (filed: keyof AdvancedFilterParams, value?: string) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
};

const DateInput = ({ value, onChange, placeholder, max }: { value: string; onChange: (value: string) => void; placeholder: string; max: string }) => {
  const [ tempValue, setTempValue ] = React.useState(value ? dayjs(value).format('YYYY-MM-DD') : '');

  React.useEffect(() => {
    setTempValue(value ? dayjs(value).format('YYYY-MM-DD') : '');
  }, [ value ]);

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTempValue(event.target.value);
    onChange(event.target.value);
  }, [ onChange ]);

  return (
    <Input
      value={ tempValue }
      onChange={ handleChange }
      placeholder={ placeholder }
      type="date"
      max={ max }
      autoComplete="off"
      size="sm"
    />
  );
};

const AgeFilter = ({ value = defaultValue, handleFilterChange, onClose }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<AgeFromToValue>({
    age: value.age || '',
    from: value.age ? '' : (value.from || ''),
    to: value.age ? '' : (value.to || ''),
  });

  const handleFromChange = React.useCallback((newValue: string) => {
    setCurrentValue(prev => ({ age: '', to: prev.to, from: newValue }));
  }, []);

  const handleToChange = React.useCallback((newValue: string) => {
    setCurrentValue(prev => ({ age: '', from: prev.from, to: newValue }));
  }, []);

  const onPresetChange = React.useCallback((age: AdvancedFilterAge) => {
    const from = dayjs((dayjs().valueOf() - getDurationFromAge(age))).toISOString();
    handleFilterChange(FILTER_PARAM_FROM, from);
    const to = dayjs().toISOString();
    handleFilterChange(FILTER_PARAM_TO, to);
    handleFilterChange(FILTER_PARAM_AGE, age);
    onClose?.();
  }, [ handleFilterChange, onClose ]);

  const onReset = React.useCallback(() => setCurrentValue(defaultValue), []);

  const onFilter = React.useCallback(() => {
    if (!currentValue.age && !currentValue.to && !currentValue.from) {
      handleFilterChange(FILTER_PARAM_FROM, undefined);
      handleFilterChange(FILTER_PARAM_TO, undefined);
      handleFilterChange(FILTER_PARAM_AGE, undefined);
      return;
    }
    const from = currentValue.age ?
      dayjs((dayjs().valueOf() - getDurationFromAge(currentValue.age))).toISOString() :
      dayjs(currentValue.from || undefined).startOf('day').toISOString();
    handleFilterChange(FILTER_PARAM_FROM, from);
    const to = currentValue.age ? dayjs().toISOString() : dayjs(currentValue.to || undefined).endOf('day').toISOString();
    handleFilterChange(FILTER_PARAM_TO, to);
    handleFilterChange(FILTER_PARAM_AGE, currentValue.age);
  }, [ handleFilterChange, currentValue ]);

  return (
    <TableColumnFilter
      title="Set last duration"
      isFilled={ Boolean(currentValue.from || currentValue.to || currentValue.age) }
      isTouched={ currentValue.age ? value.age !== currentValue.age : !isEqual(currentValue, value) }
      onFilter={ onFilter }
      onReset={ onReset }
      hasReset
    >
      <Flex gap={ 3 }>
        <PopoverCloseTriggerWrapper>
          <TagGroupSelect<AdvancedFilterAge>
            items={ ADVANCED_FILTER_AGES.map(val => ({ id: val, title: val })) }
            onChange={ onPresetChange }
            value={ currentValue.age || undefined }
          />
        </PopoverCloseTriggerWrapper>
      </Flex>
      <Flex mt={ 3 }>
        <DateInput
          value={ currentValue.age ? '' : currentValue.from }
          onChange={ handleFromChange }
          placeholder="From"
          max={ dayjs().format('YYYY-MM-DD') }
        />
        <Text mx={ 3 }>{ ndash }</Text>
        <DateInput
          value={ currentValue.age ? '' : currentValue.to }
          onChange={ handleToChange }
          placeholder="To"
          max={ dayjs().format('YYYY-MM-DD') }
        />
      </Flex>
    </TableColumnFilter>
  );
};

export default AgeFilter;
