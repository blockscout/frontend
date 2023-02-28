import { Checkbox, Flex, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { SmartContractMethodOutput } from 'types/api/contract';

import appConfig from 'configs/app/config';
import { WEI } from 'lib/consts';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  data: SmartContractMethodOutput;
}

const ContractMethodStatic = ({ data }: Props) => {
  const isBigInt = data.type.includes('int256') || data.type.includes('int128');
  const [ value, setValue ] = React.useState(isBigInt && data.value ? BigNumber(data.value).toFixed() : data.value);
  const [ label, setLabel ] = React.useState('WEI');

  const handleCheckboxChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (!data.value) {
      return;
    }

    if (event.target.checked) {
      setValue(BigNumber(data.value).div(WEI).toFixed());
      setLabel(appConfig.network.currency.symbol || 'ETH');
    } else {
      setValue(BigNumber(data.value).toFixed());
      setLabel('WEI');
    }
  }, [ data.value ]);

  const content = (() => {
    if (data.type === 'address' && data.value) {
      return (
        <Address>
          <AddressLink type="address" hash={ data.value }/>
          <CopyToClipboard text={ data.value }/>
        </Address>
      );
    }

    return <chakra.span wordBreak="break-all">({ data.type }): { value }</chakra.span>;
  })();

  return (
    <Flex flexDir={{ base: 'column', lg: 'row' }} columnGap={ 2 } rowGap={ 2 }>
      { content }
      { isBigInt && <Checkbox onChange={ handleCheckboxChange }>{ label }</Checkbox> }
    </Flex>
  );
};

export default ContractMethodStatic;
