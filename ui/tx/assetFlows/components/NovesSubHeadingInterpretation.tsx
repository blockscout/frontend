import { Box, Skeleton, Text } from '@chakra-ui/react';
import type { FC } from 'react';
import React, { Fragment } from 'react';

import type { NovesResponseData } from 'types/api/noves';

import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';
import { getDescriptionItems } from 'ui/tx/assetFlows/utils/getDescriptionItems';

import NovesTokenTransferSnippet from './NovesTokenTransferSnippet';

interface Props {
  data: NovesResponseData | undefined;
  isLoading: boolean;
}

const NovesSubHeadingInterpretation: FC<Props> = ({ data, isLoading }) => {
  if (!data) {
    return null;
  }

  const description = getDescriptionItems(data);

  return (
    <Skeleton isLoaded={ !isLoading } overflow="hidden">
      <Box display="flex" gap={ 2 } alignItems="center" flexWrap="wrap" mr={ 2 }>
        { description.map((item, i) => (
          <Fragment key={ item.text }>
            <Text fontWeight="500" fontSize="lg" display="inline-flex" alignItems="center" gap={ 2 } wordBreak="break-word">
              { i === 0 && (
                <IconSvg
                  name="lightning"
                  height="5"
                  width="5"
                  color="gray.500"
                  _dark={{ color: 'gray.400' }}
                />
              ) }
              { item.text }
            </Text>
            {
              item.actionText && (
                <Text fontWeight="500" fontSize="lg" display="inline-flex" alignItems="center" gap={ 2 } wordBreak="break-word" color="gray.500">
                  { item.actionText }
                </Text>
              )
            }
            { item.hasId && item.token ? (
              <NovesTokenTransferSnippet
                token={ item.token }
                tokenId={ item.token?.id || '' }
              />
            ) :
              item.token && (
                <TokenEntity
                  token={ item.token }
                  noCopy
                  noSymbol
                  fontWeight="500"
                  fontSize="lg"
                  w="fit-content"
                />
              ) }
          </Fragment>
        )) }
      </Box>
    </Skeleton>
  );
};

export default NovesSubHeadingInterpretation;
