import {
  Link,
  Icon,
  chakra,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useColorModeValue,
  DarkMode,
  ListItem,
  OrderedList,
  Grid,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/api/contract';

import infoIcon from 'icons/info.svg';
import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';

import { METHOD_LABELS } from '../utils';

interface Props {
  control: Control<FormFields>;
  isDisabled?: boolean;
  methods: SmartContractVerificationConfig['verification_options'];
}

const ContractVerificationFieldMethod = ({ control, isDisabled, methods }: Props) => {
  const tooltipBg = useColorModeValue('gray.700', 'gray.900');
  const isMobile = useIsMobile();

  const options = React.useMemo(() => methods.map((method) => ({
    value: method,
    label: METHOD_LABELS[method],
  })), [ methods ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'method'>}) => {
    return (
      <FancySelect
        { ...field }
        options={ options }
        size={ isMobile ? 'md' : 'lg' }
        placeholder="Verification method (compiler type)"
        isDisabled={ isDisabled }
        isRequired
        isAsync={ false }
      />
    );
  }, [ isDisabled, isMobile, options ]);

  return (
    <section>
      <Grid columnGap="30px" rowGap={{ base: 2, lg: 4 }} templateColumns={{ base: '1fr', lg: 'minmax(auto, 680px) minmax(0, 340px)' }}>
        <div>
          <Box mb={ 5 }>
            <chakra.span fontWeight={ 500 } fontSize="lg" fontFamily="heading">
            Currently, Blockscout supports { methods.length } contract verification methods
            </chakra.span>
            <Popover trigger="hover" isLazy placement={ isMobile ? 'bottom-end' : 'right-start' }>
              <PopoverTrigger>
                <chakra.span display="inline-block" ml={ 1 } cursor="pointer" verticalAlign="middle" h="22px">
                  <Icon as={ infoIcon } boxSize={ 5 } color="link" _hover={{ color: 'link_hovered' }}/>
                </chakra.span>
              </PopoverTrigger>
              <Portal>
                <PopoverContent bgColor={ tooltipBg } w={{ base: '300px', lg: '380px' }}>
                  <PopoverArrow bgColor={ tooltipBg }/>
                  <PopoverBody color="white">
                    <DarkMode>
                      <span>Currently, Blockscout supports 6 methods:</span>
                      <OrderedList>
                        <ListItem>Verification through flattened source code.</ListItem>
                        <ListItem>
                          <span>Verification using </span>
                          <Link
                            href="https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description"
                            target="_blank"
                          >
                            Standard input JSON
                          </Link>
                          <span> file.</span>
                        </ListItem>
                        <ListItem>
                          Verification through <Link href="https://sourcify.dev/" target="_blank">Sourcify</Link>.
                        </ListItem>
                        <ListItem>Verification of multi-part Solidity files.</ListItem>
                        <ListItem>Verification of Vyper contract.</ListItem>
                        <ListItem>Verification of multi-part Vyper files.</ListItem>
                      </OrderedList>
                    </DarkMode>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </Box>
          <Controller
            name="method"
            control={ control }
            render={ renderControl }
            rules={{ required: true }}
          />
        </div>
      </Grid>
    </section>
  );
};

export default React.memo(ContractVerificationFieldMethod);
