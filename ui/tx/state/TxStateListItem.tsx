import { AccordionItem, AccordionButton, AccordionIcon, Button, Box, Flex, Text, Link, StatArrow, Stat, AccordionPanel } from '@chakra-ui/react';
import React from 'react';

import type ArrayElement from 'types/utils/ArrayElement';

import appConfig from 'configs/app/config';
import type { data } from 'data/txState';
import { nbsp } from 'lib/html-entities';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';

import TxStateStorageItem from './TxStateStorageItem';

type Props = ArrayElement<typeof data>;

const TxStateListItem = ({ storage, address, miner, after, before, diff }: Props) => {

  const hasStorageData = Boolean(storage?.length);

  return (
    <AccountListItemMobile>
      <AccordionItem isDisabled={ !hasStorageData } border={ 0 } w="100%" display="flex" flexDirection="column">
        { ({ isExpanded }) => (
          <>
            <Flex mb={ 6 }>
              <AccordionButton
                _hover={{ background: 'unset' }}
                padding="0"
                mr={ 5 }
                w="auto"
              >
                <Button
                  variant="outline"
                  borderWidth="1px"
                  // button can't be inside button (AccordionButton)
                  as="div"
                  isActive={ isExpanded }
                  size="sm"
                  fontWeight={ 400 }
                  isDisabled={ !hasStorageData }
                  colorScheme="gray"
                  // AccordionButton has its own opacity rule when disabled
                  _disabled={{ opacity: 1 }}
                >
                  { storage?.length || '0' }
                </Button>
                <AccordionIcon color="blue.600" width="30px"/>
              </AccordionButton>
              <Address flexGrow={ 1 }>
                <AddressIcon hash={ address }/>
                <AddressLink hash={ address } ml={ 2 }/>
              </Address>
            </Flex>
            { hasStorageData && (
              <AccordionPanel fontWeight={ 500 } p={ 0 }>
                { storage?.map((storageItem, index) => <TxStateStorageItem key={ index } storageItem={ storageItem }/>) }
              </AccordionPanel>
            ) }
            <Flex rowGap={ 2 } flexDir="column" fontSize="sm" whiteSpace="pre" fontWeight={ 500 }>
              <Box>
                <Text as="span">Miner </Text>
                <Link>{ miner }</Link>
              </Box>
              <Box>
                <Text as="span">Before { appConfig.network.currency.name } </Text>
                <Text as="span" variant="secondary">{ before.balance }</Text>
              </Box>
              { typeof before.nonce !== 'undefined' && (
                <Box>
                  <Text as="span">Nonce:</Text>
                  <Text as="span" fontWeight={ 600 }>{ nbsp }{ before.nonce }</Text>
                </Box>
              ) }
              <Box>
                <Text as="span">After { appConfig.network.currency.name } </Text>
                <Text as="span" variant="secondary">{ after.balance }</Text>
              </Box>
              { typeof after.nonce !== 'undefined' && (
                <Box>
                  <Text as="span">Nonce:</Text>
                  <Text as="span" fontWeight={ 600 }>{ nbsp }{ after.nonce }</Text>
                </Box>
              ) }
              <Text>State difference { appConfig.network.currency.name }</Text>
              <Stat>
                { diff }
                <StatArrow ml={ 2 } type={ Number(diff) > 0 ? 'increase' : 'decrease' }/>
              </Stat>
            </Flex>
          </>
        ) }
      </AccordionItem>
    </AccountListItemMobile>
  );
};

export default TxStateListItem;
