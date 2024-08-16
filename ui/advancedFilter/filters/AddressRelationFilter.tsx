import { Radio, RadioGroup, Stack, Box } from '@chakra-ui/react';
import React from 'react';

import { type AdvancedFilterParams } from 'types/api/advancedFilter';

const FILTER_PARAM = 'address_relation';

type Value = 'or' | 'and';

const DEFAULT_VALUE = 'or' as Value;

type Props = {
  value?: Value;
  handleFilterChange: (filed: keyof AdvancedFilterParams, value?: string) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
}

const AddressRelationFilter = ({ value = DEFAULT_VALUE, handleFilterChange, onClose }: Props) => {
  const onFilter = React.useCallback((val: Value) => {
    onClose && onClose();
    handleFilterChange(FILTER_PARAM, val);
  }, [ handleFilterChange, onClose ]);

  return (
    <Box w="120px">
      <RadioGroup onChange={ onFilter } value={ value }>
        <Stack direction="column">
          <Radio value="or">OR</Radio>
          <Radio value="and">AND</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default AddressRelationFilter;
