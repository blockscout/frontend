import { chakra, FormLabel, FormControl, Switch } from '@chakra-ui/react';
import React from 'react';

import Hint from 'ui/shared/Hint';

interface Props {
  onChange: (isChecked: boolean) => void;
  initialValue?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const UserOpCallDataSwitch = ({ className, initialValue, isDisabled, onChange }: Props) => {
  const [ isChecked, setIsChecked ] = React.useState(initialValue ?? false);

  const handleChange = React.useCallback(() => {
    setIsChecked((prevValue) => {
      const nextValue = !prevValue;
      onChange(nextValue);
      return nextValue;
    });
  }, [ onChange ]);

  return (
    <FormControl className={ className } display="flex" columnGap={ 2 } ml="auto" w="fit-content">
      <FormLabel htmlFor="isExternal" fontSize="sm" lineHeight={ 5 } fontWeight={ 600 } m={ 0 }>
        Show external call data
      </FormLabel>
      <Switch id="isExternal" isChecked={ isChecked } isDisabled={ isDisabled } onChange={ handleChange }/>
      <Hint label="Inner call data is a predicted decoded call from this user operation"/>
    </FormControl>
  );
};

export default React.memo(chakra(UserOpCallDataSwitch));
