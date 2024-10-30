import { FormControl, Input, InputGroup, InputRightElement, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import FormInputPlaceholder from 'ui/shared/forms/inputs/FormInputPlaceholder';

type Props = {
  label: string;
  value: string;
  className?: string;
  isLoading?: boolean;
};

const RewardsReadOnlyInputWithCopy = ({ label, value, className, isLoading }: Props) => (
  <FormControl variant="floating" id={ label } className={ className }>
    <Skeleton isLoaded={ !isLoading }>
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
