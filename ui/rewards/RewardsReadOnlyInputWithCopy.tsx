import { chakra } from '@chakra-ui/react';
import React from 'react';

import { Field } from 'toolkit/chakra/field';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

type Props = {
  label: string;
  value: string;
  className?: string;
  isLoading?: boolean;
};

const RewardsReadOnlyInputWithCopy = ({ label, value, className, isLoading }: Props) => {
  return (
    <Skeleton loading={ isLoading } className={ className }>
      <Field label={ label } floating size="xl" readOnly>
        <InputGroup endElement={ <CopyToClipboard text={ value }/> }>
          <Input value={ value } fontWeight="500" overflow="hidden" textOverflow="ellipsis"/>
        </InputGroup>
      </Field>
    </Skeleton>
  );
};

export default chakra(RewardsReadOnlyInputWithCopy);
