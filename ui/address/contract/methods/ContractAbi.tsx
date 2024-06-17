import { Accordion, Box, Flex, Link } from '@chakra-ui/react';
import _range from 'lodash/range';
import React from 'react';

import type { SmartContractMethod } from '../types';

import ContractAbiItem from './ContractAbiItem';
import useFormSubmit from './useFormSubmit';
import useScrollToMethod from './useScrollToMethod';

interface Props {
  data: Array<SmartContractMethod>;
  addressHash: string;
  tab: string;
}

const ContractAbi = ({ data, addressHash, tab }: Props) => {
  const [ expandedSections, setExpandedSections ] = React.useState<Array<number>>(data.length === 1 ? [ 0 ] : []);
  const [ id, setId ] = React.useState(0);

  useScrollToMethod(data, setExpandedSections);

  const handleFormSubmit = useFormSubmit({ addressHash });

  const handleAccordionStateChange = React.useCallback((newValue: Array<number>) => {
    setExpandedSections(newValue);
  }, []);

  const handleExpandAll = React.useCallback(() => {
    if (!data) {
      return;
    }

    if (expandedSections.length < data.length) {
      setExpandedSections(_range(0, data.length));
    } else {
      setExpandedSections([]);
    }
  }, [ data, expandedSections.length ]);

  const handleReset = React.useCallback(() => {
    setId((id) => id + 1);
  }, []);

  if (data.length === 0) {
    return null;
  }

  return (
    <>
      <Flex mb={ 3 }>
        <Box fontWeight={ 500 } mr="auto">Contract information</Box>
        { data.length > 1 && (
          <Link onClick={ handleExpandAll }>
            { expandedSections.length === data.length ? 'Collapse' : 'Expand' } all
          </Link>
        ) }
        <Link onClick={ handleReset } ml={ 3 }>Reset</Link>
      </Flex>
      <Accordion allowMultiple position="relative" onChange={ handleAccordionStateChange } index={ expandedSections }>
        { data.map((item, index) => (
          <ContractAbiItem
            key={ index }
            data={ item }
            id={ id }
            index={ index }
            addressHash={ addressHash }
            tab={ tab }
            onSubmit={ handleFormSubmit }
          />
        )) }
      </Accordion>
    </>
  );
};

export default React.memo(ContractAbi);
