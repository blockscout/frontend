import { Flex, Text } from '@chakra-ui/react';
import { isEqual } from 'es-toolkit';
import type { ChangeEvent } from 'react';
import React from 'react';

import { ADVANCED_FILTER_AGES, type AdvancedFilterAge } from 'types/api/advancedFilter';
import { type ZetaChainCCTXFilterParams } from 'types/api/zetaChain';

import dayjs from 'lib/date/dayjs';
import { Input } from 'toolkit/chakra/input';
import { PopoverCloseTriggerWrapper } from 'toolkit/chakra/popover';
import { ndash } from 'toolkit/utils/htmlEntities';
import { getDurationFromAge } from 'ui/advancedFilter/lib';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';
import TagGroupSelect from 'ui/shared/tagGroupSelect/TagGroupSelect';

const FILTER_PARAM_FROM = 'start_timestamp';
const FILTER_PARAM_TO = 'end_timestamp';
const FILTER_PARAM_AGE = 'age';

const defaultValue = { age: '', from: '', to: '' } as const;
type AgeFromToValue = { age: AdvancedFilterAge | ''; from: string; to: string };

type Props = {
  value?: AgeFromToValue;
  handleFilterChange: (field: keyof ZetaChainCCTXFilterParams, value?: string) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
};

const DateInput = ({ value, onChange, placeholder, max }: { value: string; onChange: (value: string) => void; placeholder: string; max: string }) => {
  const [ tempValue, setTempValue ] = React.useState(value || '');

  // reset
  React.useEffect(() => {
    if (!value) {
      setTempValue('');
    }
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

const ZetaChainAgeFilter = ({ value = defaultValue, handleFilterChange }: Props) => {
  const getFromValue = () => {
    if (value.age) return '';
    return value.from ? dayjs(Number(value.from) * 1000).format('YYYY-MM-DD') : '';
  };

  const getToValue = () => {
    if (value.age) return '';
    return value.to ? dayjs(Number(value.to) * 1000).format('YYYY-MM-DD') : '';
  };

  const [ currentValue, setCurrentValue ] = React.useState<AgeFromToValue>({
    age: value.age || '',
    from: getFromValue(),
    to: getToValue(),
  });

  const handleFromChange = React.useCallback((newValue: string) => {
    setCurrentValue(prev => ({ age: '', to: prev.to, from: newValue }));
  }, []);

  const handleToChange = React.useCallback((newValue: string) => {
    setCurrentValue(prev => ({ age: '', from: prev.from, to: newValue }));
  }, []);

  const onPresetChange = React.useCallback((age: AdvancedFilterAge) => {
    const from = dayjs((dayjs().valueOf() - getDurationFromAge(age))).unix().toString();
    handleFilterChange(FILTER_PARAM_FROM, from);
    const to = dayjs().unix().toString();
    handleFilterChange(FILTER_PARAM_TO, to);
    handleFilterChange(FILTER_PARAM_AGE, age);
  }, [ handleFilterChange ]);

  const onReset = React.useCallback(() => setCurrentValue(defaultValue), []);

  const onFilter = React.useCallback(() => {
    if (!currentValue.age && !currentValue.to && !currentValue.from) {
      handleFilterChange(FILTER_PARAM_FROM, undefined);
      handleFilterChange(FILTER_PARAM_TO, undefined);
      handleFilterChange(FILTER_PARAM_AGE, undefined);
      return;
    }

    if (currentValue.age) {
      // Age preset is selected, calculate timestamps
      const from = dayjs((dayjs().valueOf() - getDurationFromAge(currentValue.age))).unix().toString();
      const to = dayjs().unix().toString();
      handleFilterChange(FILTER_PARAM_FROM, from);
      handleFilterChange(FILTER_PARAM_TO, to);
      handleFilterChange(FILTER_PARAM_AGE, currentValue.age);
    } else {
      // Custom date range is selected
      const from = currentValue.from ? dayjs(currentValue.from).startOf('day').unix().toString() : undefined;
      const to = currentValue.to ? dayjs(currentValue.to).endOf('day').unix().toString() : undefined;
      handleFilterChange(FILTER_PARAM_FROM, from);
      handleFilterChange(FILTER_PARAM_TO, to);
      handleFilterChange(FILTER_PARAM_AGE, undefined);
    }
  }, [ handleFilterChange, currentValue ]);

  // Check if the current values differ from the original values
  const isTouched = React.useMemo(() => {
    if (currentValue.age) {
      return value.age !== currentValue.age;
    }

    // If both current values are empty and both original values are empty, not touched
    if (!currentValue.from && !currentValue.to && !value.from && !value.to) {
      return false;
    }

    // Convert original timestamps to date strings for comparison
    const originalValueAsDates = {
      from: value.from ? dayjs(Number(value.from) * 1000).format('YYYY-MM-DD') : '',
      to: value.to ? dayjs(Number(value.to) * 1000).format('YYYY-MM-DD') : '',
    };

    // Compare the date strings directly
    return !isEqual(currentValue, originalValueAsDates);
  }, [ currentValue, value ]);

  return (
    <TableColumnFilter
      title="Set last duration"
      isFilled={ Boolean(currentValue.from || currentValue.to || currentValue.age) }
      isTouched={ isTouched }
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

export default ZetaChainAgeFilter;
