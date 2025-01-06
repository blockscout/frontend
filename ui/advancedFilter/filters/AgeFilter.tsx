import { Flex, Input, Text } from '@chakra-ui/react';
import isEqual from 'lodash/isEqual';
import type { ChangeEvent } from 'react';
import React from 'react';

import { ADVANCED_FILTER_AGES, type AdvancedFilterAge, type AdvancedFilterParams } from 'types/api/advancedFilter';

import dayjs from 'lib/date/dayjs';
import { ndash } from 'lib/html-entities';
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

const AgeFilter = ({ value = defaultValue, handleFilterChange, onClose }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<AgeFromToValue>({
    age: value.age,
    from: value.age ? '' : value.from,
    to: value.age ? '' : value.to,
  });

  const handleFromChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(prev => ({ age: '', to: prev.to, from: event.target.value }));
  }, []);

  const handleToChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(prev => ({ age: '', from: prev.from, to: event.target.value }));
  }, []);

  const onPresetChange = React.useCallback((age: AdvancedFilterAge) => {
    const from = dayjs((dayjs().valueOf() - getDurationFromAge(age))).toISOString();
    handleFilterChange(FILTER_PARAM_FROM, from);
    const to = dayjs().toISOString();
    handleFilterChange(FILTER_PARAM_TO, to);
    handleFilterChange(FILTER_PARAM_AGE, age);
    onClose && onClose();
  }, [ onClose, handleFilterChange ]);

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
      dayjs(currentValue.from).startOf('day').toISOString();
    handleFilterChange(FILTER_PARAM_FROM, from);
    const to = currentValue.age ? dayjs().toISOString() : dayjs(currentValue.to).endOf('day').toISOString();
    handleFilterChange(FILTER_PARAM_TO, to);
    handleFilterChange(FILTER_PARAM_AGE, currentValue.age);
  }, [ handleFilterChange, currentValue ]);

  return (
    <TableColumnFilter
      title="Set last duration"
      isFilled={ Boolean(currentValue.from || currentValue.to || currentValue.age) }
      isTouched={ value.age ? value.age !== currentValue.age : !isEqual(currentValue, value) }
      onFilter={ onFilter }
      onReset={ onReset }
      onClose={ onClose }
      hasReset
    >
      <Flex gap={ 3 }>
        <TagGroupSelect<AdvancedFilterAge>
          items={ ADVANCED_FILTER_AGES.map(val => ({ id: val, title: val })) }
          onChange={ onPresetChange }
          value={ currentValue.age || undefined }
        />
      </Flex>
      <Flex mt={ 3 }>
        <Input
          value={ currentValue.age ? '' : dayjs(currentValue.from).format('YYYY-MM-DD') }
          onChange={ handleFromChange }
          placeholder="From"
          type="date"
          size="xs"
        />
        <Text mx={ 3 }>{ ndash }</Text>
        <Input
          value={ currentValue.age ? '' : dayjs(currentValue.to).format('YYYY-MM-DD') }
          onChange={ handleToChange }
          placeholder="To"
          type="date"
          size="xs"
        />
      </Flex>
    </TableColumnFilter>
  );
};

export default AgeFilter;
