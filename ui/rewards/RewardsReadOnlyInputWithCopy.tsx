import { chakra } from '@chakra-ui/react';
import React from 'react';
import { InputGroup } from 'toolkit/chakra/input-group';
import Input from 'theme/components/Input';
import { Skeleton } from 'toolkit/chakra/skeleton';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import FormInputPlaceholder from 'ui/shared/forms/inputs/FormInputPlaceholder';
import { Field } from 'toolkit/chakra/field';

type Props = {
  label: string;
  value: string;
  className?: string;
  isLoading?: boolean;
};

const RewardsReadOnlyInputWithCopy = ({ label, value, className, isLoading }: Props) => (
  <Field floating id={ label } className={ className }>
    <Skeleton loading={ isLoading }>
      <InputGroup>
        <Input
          readOnly
          fontWeight="500"
          value={ value }
          overflow="hidden"
          textOverflow="ellipsis"
          sx={{
            '&:not(:placeholder-shown)': {
              pr: '40px',
            },
          }}
        />
        <FormInputPlaceholder text={ label }/>
        <InputRightElement w="40px" display="flex" justifyContent="flex-end" pr={ 2 }>
          <CopyToClipboard text={ value }/>
        </InputRightElement>
      </InputGroup>
    </Skeleton>
  </FormControl>
);

export default chakra(RewardsReadOnlyInputWithCopy);
