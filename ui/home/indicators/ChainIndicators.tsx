import { Box, Flex, Icon, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import globeIcon from 'icons/globe.svg';
import infoIcon from 'icons/info.svg';
import txIcon from 'icons/transactions.svg';

import ChainIndicatorChart from './ChainIndicatorChart';
import ChainIndicatorItem from './ChainIndicatorItem';

const INDICATORS = [
  {
    name: 'Daily transactions',
    value: '1,531.14 M',
    icon: <Icon as={ txIcon } boxSize={ 6 } bgColor="#56ACD1" borderRadius="base" color="white"/>,
    hint: `The total daily number of transactions on the blockchain for the last month.`,
  },
  {
    name: `${ appConfig.network.currency.symbol } price`,
    value: '$0.998566',
    // todo_tom change to TokenLogo after token-transfers branch merge
    icon: <Icon as={ globeIcon } boxSize={ 6 } bgColor="#6A5DCC" borderRadius="base" color="white"/>,
    hint: `${ appConfig.network.currency.symbol } daily price in USD.`,
  },
  {
    name: 'Market cap',
    value: '$379M',
    icon: <Icon as={ globeIcon } boxSize={ 6 } bgColor="#6A5DCC" borderRadius="base" color="white"/>,
    // eslint-disable-next-line max-len
    hint: 'The total market value of a cryptocurrency\'s circulating supply. It is analogous to the free-float capitalization in the stock market. Market Cap = Current Price x Circulating Supply.',
  },
];

const ChainIndicators = () => {
  const [ selectedIndicator, selectIndicator ] = React.useState(INDICATORS[0].name);

  const bgColor = useColorModeValue('white', 'gray.900');
  const listBgColor = useColorModeValue('gray.50', 'black');

  const indicator = INDICATORS.find(({ name }) => name === selectedIndicator);

  return (
    <Flex p={ 8 } borderRadius="lg" boxShadow="lg" bgColor={ bgColor } columnGap={ 12 } w="100%" alignItems="flex-start">
      <Flex flexGrow={ 1 } flexDir="column">
        <Flex alignItems="center">
          <Text fontWeight={ 500 } fontFamily="Poppins" fontSize="lg">{ indicator?.name }</Text>
          { indicator?.hint && (
            <Tooltip label={ indicator.hint } maxW="300px">
              <Box display="inline-flex" cursor="pointer" ml={ 1 }>
                <Icon as={ infoIcon } boxSize={ 4 }/>
              </Box>
            </Tooltip>
          ) }
        </Flex>
        <Text fontWeight={ 600 } fontFamily="Poppins" fontSize="48px" lineHeight="48px" mt={ 3 } mb={ 4 }>{ indicator?.value }</Text>
        <ChainIndicatorChart/>
      </Flex>
      <Flex flexShrink={ 0 } flexDir="column" as="ul" p={ 3 } borderRadius="lg" bgColor={ listBgColor } rowGap={ 3 }>
        { INDICATORS.map((indicator) => (
          <ChainIndicatorItem
            key={ indicator.name }
            { ...indicator }
            isSelected={ selectedIndicator === indicator.name }
            onClick={ selectIndicator }
          />
        )) }
      </Flex>
    </Flex>
  );
};

export default ChainIndicators;
