// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlexProps } from '@chakra-ui/react';
import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import useIsInitialLoading from 'src/shared/hooks/useIsInitialLoading';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Switch } from 'src/toolkit/chakra/switch';
import { Hint } from 'src/toolkit/components/Hint/Hint';

interface Props extends Omit<FlexProps, 'onChange'> {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  isLoading?: boolean;
}

const InternalTxsZeroValueSwitch = ({ isChecked, onChange, isLoading, ...rest }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const handleCheckedChange = React.useCallback(({ checked }: { checked: boolean }) => {
    onChange(checked);
  }, [ onChange ]);

  return (
    <Flex alignItems="center" gap={ 1 } h={ 8 } { ...rest }>
      <Skeleton loading={ isInitialLoading } asChild>
        { /* uncontrolled on purpose: the URL update behind onChange is async, and a controlled input would snap back
             to the stale value until it lands; the key remounts the switch once the URL value changes */ }
        <Switch
          key={ String(isChecked) }
          size="sm"
          defaultChecked={ isChecked }
          onCheckedChange={ handleCheckedChange }
          labelProps={{ textStyle: 'sm' }}
          direction="rtl"
        >
          <chakra.span hideBelow="lg">Show zero-value txs</chakra.span>
          <chakra.span hideFrom="lg">Zero-value txs</chakra.span>
        </Switch>
      </Skeleton>
      <Hint
        label="Zero-value internal transactions are calls that transfer no native coin. Contract creation transactions are always shown."
        isLoading={ isInitialLoading }
      />
    </Flex>
  );
};

export default React.memo(InternalTxsZeroValueSwitch);
