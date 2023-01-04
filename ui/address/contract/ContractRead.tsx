import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Link } from '@chakra-ui/react';
import _range from 'lodash/range';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractReadItemInput from './ContractReadItemInput';
import ContractReadItemOutput from './ContractReadItemOutput';

const ContractRead = () => {
  const router = useRouter();
  const [ expandedSections, setExpandedSections ] = React.useState<Array<number>>([]);

  const { data, isLoading, isError } = useApiQuery('contract_methods_read', {
    pathParams: { id: router.query.id?.toString() },
    queryOptions: {
      enabled: Boolean(router.query.id),
    },
  });

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

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading) {
    return <span>loading...</span>;
  }

  return (
    <Accordion allowMultiple position="relative" onChange={ handleAccordionStateChange } index={ expandedSections }>
      { data.map((item, index) => {
        return (
          <AccordionItem key={ item.name + '_' + item.method_id } as="section">
            <h2>
              <AccordionButton px={ 0 } py={ 3 } _hover={{ bgColor: 'inherit' }}>
                <Box as="span" fontFamily="heading" fontWeight={ 500 } fontSize="lg" mr={ 1 }>
                  { index + 1 }. { item.name }
                </Box>
                <AccordionIcon/>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={ 4 }>
              { item.inputs.length === 0 ? (
                <Flex flexDir="column" rowGap={ 1 }>
                  { item.outputs.map((output, index) => <ContractReadItemOutput key={ index } data={ output }/>) }
                </Flex>
              ) : (
                <ContractReadItemInput key={ index } data={ item.inputs }/>
              ) }
            </AccordionPanel>
          </AccordionItem>
        );
      }) }
      <Flex columnGap={ 3 } position="absolute" top={ 0 } right={ 0 } py={ 3 } lineHeight="27px">
        <Link onClick={ handleExpandAll }>{ expandedSections.length === data.length ? 'Collapse' : 'Expand' } all</Link>
        <Link>Reset</Link>
      </Flex>
    </Accordion>
  );
};

export default ContractRead;
