// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { TxInterpretationSummary } from 'src/features/tx-interpretation/common/types/api';

import { currencyUnits } from 'src/slices/chain/units';

import ChainIcon from 'src/shared/external-chains/ChainIcon';
import getChainTooltipText from 'src/shared/external-chains/get-chain-tooltip-text';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Badge } from 'src/toolkit/chakra/badge';
import { useColorModeValue } from 'src/toolkit/chakra/color-mode';
import { Image } from 'src/toolkit/chakra/image';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import { parseSummaryTemplate, NATIVE_COIN_SYMBOL_VAR_NAME, WEI_VAR_NAME } from '../utils/utils';
import type { NonStringTxInterpretationVariable } from './TxInterpretationElementByType';
import TxInterpretationElementByType from './TxInterpretationElementByType';

interface Props extends BoxProps {
  summary?: TxInterpretationSummary;
  isLoading?: boolean;
  addressDataMap?: Record<string, schemas['Address']>;
  className?: string;
  isNoves?: boolean;
  chainData?: ClusterChainConfig;
};

const TxInterpretation = ({ summary, isLoading, addressDataMap, className, chainData, isNoves, ...rest }: Props) => {
  const novesLogoUrl = useColorModeValue('/static/noves-logo.svg', '/static/noves-logo-dark.svg');
  if (!summary) {
    return null;
  }

  const parts = parseSummaryTemplate(summary);

  if (!parts) {
    return null;
  }

  const variables = summary.summary_template_variables;
  const { chunks, variablesNames } = parts;

  const tooltipContent = 'Transaction summary' + (chainData ? `\n${ getChainTooltipText(chainData) }` : '');

  return (
    <Skeleton loading={ isLoading } className={ className } fontWeight={ 500 } whiteSpace="pre-wrap" { ...rest }>
      <Tooltip content={ tooltipContent } contentProps={{ whiteSpace: 'pre-wrap' }}>
        <Box display="inline-flex" position="relative" mr={ chainData ? '14px' : 1 } verticalAlign="text-top">
          <SpriteIcon name="lightning" boxSize={ 5 } color="icon.primary"/>
          { chainData && (
            <ChainIcon
              data={ chainData }
              boxSize="18px"
              position="absolute"
              top="6px"
              left="12px"
              borderRadius="full"
              borderWidth="1px"
              borderStyle="solid"
              borderColor="bg.primary"
              backgroundColor="bg.primary"
              noTooltip
            />
          ) }
        </Box>
      </Tooltip>
      { chunks.map((chunk, index) => {
        let content = null;
        if (variablesNames[index] === NATIVE_COIN_SYMBOL_VAR_NAME) {
          content = <chakra.span>{ currencyUnits.ether + ' ' }</chakra.span>;
        } else if (variablesNames[index] === WEI_VAR_NAME) {
          content = <chakra.span>{ currencyUnits.wei + ' ' }</chakra.span>;
        } else {
          content = (
            <TxInterpretationElementByType
              variable={ variables[variablesNames[index]] as NonStringTxInterpretationVariable }
              addressDataMap={ addressDataMap }
            />
          );
        }
        const trimmedChunk = chunk.trim();
        const textColor = trimmedChunk.includes('failed to call') ? 'text.error' : 'text.secondary';

        return (
          <chakra.span key={ chunk + index }>
            <chakra.span color={ textColor }>{ trimmedChunk + (trimmedChunk && variablesNames[index] ? ' ' : '') }</chakra.span>
            { index < variablesNames.length && content }
          </chakra.span>
        );
      }) }
      { isNoves && (
        <Tooltip content="Human readable transaction provided by Noves.fi">
          <Badge ml={ 2 } verticalAlign="unset" transform="translateY(-2px)">
            by
            <Image src={ novesLogoUrl } alt="Noves logo" h="12px" ml={ 1.5 } display="inline"/>
          </Badge>
        </Tooltip>
      ) }
    </Skeleton>
  );
};

export default chakra(TxInterpretation);
