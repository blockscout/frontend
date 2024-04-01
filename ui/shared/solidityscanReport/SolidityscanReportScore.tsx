import { Box, Flex, Text, chakra, Center, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import useScoreLevelAndColor from './useScoreLevelAndColor';

interface Props {
  className?: string;
  score: number;
}

const SolidityscanReportScore = ({ className, score }: Props) => {
  const { scoreLevel, scoreColor } = useScoreLevelAndColor(score);

  const chartGrayColor = useColorModeValue('gray.100', 'gray.700');
  const yetAnotherGrayColor = useColorModeValue('gray.400', 'gray.500');
  const popoverBgColor = useColorModeValue('white', 'gray.900');

  return (
    <Flex className={ className } alignItems="center">
      <Box
        w={ 12 }
        h={ 12 }
        bgGradient={ `conic-gradient(${ scoreColor } 0, ${ scoreColor } ${ score }%, ${ chartGrayColor } 0, ${ chartGrayColor } 100%)` }
        borderRadius="24px"
        position="relative"
        mr={ 3 }
      >
        <Center position="absolute" w="38px" h="38px" top="5px" right="5px" bg={ popoverBgColor } borderRadius="20px">
          <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } boxSize={ 5 } color={ scoreColor }/>
        </Center>
      </Box>
      <Box>
        <Flex>
          <Text color={ scoreColor } fontSize="lg" fontWeight={ 500 }>{ score }</Text>
          <Text color={ yetAnotherGrayColor } fontSize="lg" fontWeight={ 500 } whiteSpace="pre"> / 100</Text>
        </Flex>
        <Text color={ scoreColor } fontWeight={ 500 }>Security score is { scoreLevel }</Text>
      </Box>
    </Flex>
  );
};

export default chakra(SolidityscanReportScore);
