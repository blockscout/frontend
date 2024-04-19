/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

import IconSvg from 'ui/shared/IconSvg';

export type ContractItemTypes = {
  inputs?: Array<any>;
  name?: string;
  outputs?: Array<any>;
  stateMutability?: string;
  type?: string;
};

type PropTypes = {
  serialNo?: number;
  data: ContractItemTypes;
  currentTab: 'read' | 'write' | 'contract' | 'transactions';
  handleWrite: Function;
  setExpandedIndex: any;
  expandedIndex: number | string;
  lastIndex: number;
};
const NuiContractMethodsAccordionItem = ({
  data,
  currentTab,
  serialNo,
  handleWrite,
  setExpandedIndex,
  expandedIndex,
  lastIndex,
}: PropTypes) => {
  const [ state, setState ] = useState<Record<string, any>>({});
  const disabledWriteBtn: boolean = useMemo(() => {
    return (
      Boolean(data?.inputs?.length) &&
      !Object.values(state?.[data?.name as string] ?? {})?.length
    );
  }, [ data, state ]);

  return (
    <AccordionItem
      borderTopWidth={
        expandedIndex === serialNo || serialNo === Number(expandedIndex) + 1 ?
          'inherit' :
          '1px'
      }
      borderBottomWidth={
        lastIndex === expandedIndex ? 'inherit !important' : undefined
      }
    >
      <AccordionButton
        display="flex"
        gap={ 2 }
        padding="24px 16px"
        color={ useColorModeValue('black_secondary', 'gray.1300') }
        _expanded={{ bg: 'gray.1000', borderTopRadius: '12px' }}
        onClick={ () => {
          if (expandedIndex === serialNo) {
            setExpandedIndex('');
          } else {
            setExpandedIndex(serialNo);
          }
        } }
      >
        <Flex gap={ 2 } fontWeight="medium" fontSize="16px">
          <p> { Number(serialNo) + 1 }.</p>
          <Box>{ data?.name }</Box>
        </Flex>
        <AccordionIcon
          fontSize="24px"
          color="rgba(113, 128, 150, 1)"
          fontWeight="medium"
        />
      </AccordionButton>
      <AccordionPanel
        pb={ 4 }
        pt={ 0 }
        backgroundColor="rgba(244, 244, 244, 1)"
        borderBottomRadius="12px"
      >
        <Flex direction="column" gap={ 2 }>
          { data?.inputs && data?.inputs?.map((ele: any) => {
            let eleName = ele?.name;
            if (!eleName && ele?.type === 'string') {
              eleName = '<input>';
            }
            return (
              <Flex key={ ele?.name } direction="column" gap={ 1 }>
                <Text
                  color="rgba(30, 30, 30, 0.4)"
                  fontSize="12px"
                  fontWeight="500"
                >
                  { eleName }({ ele?.type })
                </Text>
                <Input
                  value={ state?.[data?.name as string]?.[ele?.name as string] }
                  backgroundColor="white"
                  height={ 10 }
                  px={ 2 }
                  borderRadius="6px"
                  fontSize="12px"
                  onChange={ (e) => {
                    setState((prev) => {
                      return {
                        ...prev,
                        [data?.name as string]: {
                          ...prev?.[data?.name as string],
                          [ele?.name as string]: e?.target?.value,
                        },
                      };
                    });
                  } }
                  placeholder={ `${ eleName } (${ ele?.type })` }
                />
              </Flex>
            );
          }) }
        </Flex>
        { currentTab === 'write' && (
          <Button
            fontSize="12px"
            px={ 4 }
            py={ 2 }
            lineHeight="12px"
            height="auto"
            disabled={ disabledWriteBtn }
            className={ `w-32 ${ disabledWriteBtn ? 'bg-gray-400' : '' }` }
            onClick={ () => {
              handleWrite(data, state?.[data?.name as string]);
            } }
            mt={ 3 }
            variant="outline"
          >
            Write
          </Button>
        ) }
        { currentTab === 'read' && (data?.inputs as Array<any>)?.length > 0 && (
          <Button className="w-32 bg-blue-500">Query</Button>
        ) }
        { data?.outputs && data?.outputs?.length > 0 && (
          <Flex gap={ 2 } alignItems="center">
            <IconSvg name="arrows/down-right" boxSize={ 5 }/>
            <Text color="black_secondary" fontWeight="semibold">
              { data?.outputs?.map((ele: any) => ele?.type)?.join(', ') }
            </Text>
          </Flex>
        ) }
      </AccordionPanel>
    </AccordionItem>
  );
};

export default React.memo(NuiContractMethodsAccordionItem);
