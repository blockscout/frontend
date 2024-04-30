import { Box, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NovesFromTo from 'ui/shared/Noves/NovesFromTo';

import NovesActionSnippet from './components/NovesActionSnippet';
import type { NovesFlowViewItem } from './utils/generateFlowViewData';

type Props = {
  isPlaceholderData: boolean;
  item: NovesFlowViewItem;
};

const TxAssetFlowsListItem = (props: Props) => {

  return (
    <ListItemMobile rowGap={ 4 } w="full" >
      <Skeleton borderRadius="sm" isLoaded={ !props.isPlaceholderData } w="full">

        <Box display="flex" >
          <IconSvg
            name="lightning"
            height="5"
            width="5"
            color="text_secondary"
          />

          <Text fontSize="sm" fontWeight={ 500 }>
            Action
          </Text>
        </Box>

      </Skeleton>

      <NovesActionSnippet item={ props.item } isLoaded={ !props.isPlaceholderData }/>

      <Box maxW="full">
        <NovesFromTo item={ props.item } isLoaded={ !props.isPlaceholderData }/>
      </Box>
    </ListItemMobile>
  );
};

export default React.memo(TxAssetFlowsListItem);
