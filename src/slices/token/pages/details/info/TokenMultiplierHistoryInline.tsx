// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TokenMultiplierChangeStatusTag from 'src/slices/token/components/ui-multiplier/TokenMultiplierChangeStatusTag';
import TokenMultiplierChangeValue from 'src/slices/token/components/ui-multiplier/TokenMultiplierChangeValue';
import { TOKEN_UI_MULTIPLIER_CHANGE } from 'src/slices/token/stubs';
import { getUiMultiplierChangeStatuses } from 'src/slices/token/utils/ui-multiplier';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import { generateListStub } from 'src/shared/pagination/utils';
import { route } from 'src/shared/router/routes';

import { CollapsibleDetails } from 'src/toolkit/chakra/collapsible';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

export const INLINE_HISTORY_MAX_ITEMS = 5;

interface Props {
  hash: string;
  changesCount: number;
}

const TokenMultiplierHistoryInline = ({ hash, changesCount }: Props) => {
  const multichainContext = useMultichainContext();
  // latched on the first expand, so collapsing and re-expanding reuses the cached page instead of refetching it
  const [ isEnabled, setIsEnabled ] = React.useState(false);

  const handleToggle = React.useCallback(() => {
    setIsEnabled(true);
  }, []);

  const query = useApiQuery('core:token_ui_multiplier_changes', {
    pathParams: { hash },
    queryOptions: {
      enabled: isEnabled,
      placeholderData: generateListStub<'core:token_ui_multiplier_changes'>(
        TOKEN_UI_MULTIPLIER_CHANGE,
        Math.min(changesCount, INLINE_HISTORY_MAX_ITEMS),
        { next_page_params: null },
      ),
    },
  });

  const viewAllUrl = route({
    pathname: '/token/[hash]',
    query: { hash, tab: 'multiplier_history' },
  }, { chain: multichainContext?.chain });

  const items = query.data?.items.slice(0, INLINE_HISTORY_MAX_ITEMS);
  const isLoading = query.isPlaceholderData;
  const statuses = items ? getUiMultiplierChangeStatuses(items, 1) : [];

  const content = !query.isError && items && items.length > 0 ? (
    <Box
      w="100%"
      maxW={{ base: '100%', lg: undefined }}
      overflowX={{ base: 'scroll', lg: 'unset' }}
    >
      <Grid
        gridTemplateColumns="120px 100px 140px 170px 80px"
        alignItems="center"
        textStyle="sm"
        bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
        p={{ base: 3, lg: 4 }}
        mt={ 1 }
        columnGap={ 5 }
        rowGap={ 4 }
        borderBottomRightRadius="base"
        borderBottomLeftRadius="base"
        w="fit-content"
      >
        <GridItem fontWeight={ 600 }>Txn hash</GridItem>
        <GridItem fontWeight={ 600 }>Block</GridItem>
        <GridItem fontWeight={ 600 }>Multiplier</GridItem>
        <GridItem fontWeight={ 600 }>
          Activation date
          <TimeFormatToggle/>
        </GridItem>
        <GridItem fontWeight={ 600 }>Status</GridItem>
        { items.map((item, index) => {
          const status = statuses[index];
          return (
            <React.Fragment key={ `${ item.block_number }-${ item.log_index }` + (isLoading ? String(index) : '') }>
              { item.transaction_hash ? (
                <TxEntity
                  hash={ item.transaction_hash }
                  isLoading={ isLoading }
                  noIcon
                  truncation="constant"
                />
              ) : (
                <Skeleton loading={ isLoading } display="inline-block" color="text.secondary">N/A</Skeleton>
              ) }
              <BlockEntity number={ item.block_number } isLoading={ isLoading } noIcon/>
              <TokenMultiplierChangeValue
                oldMultiplier={ item.old_multiplier }
                newMultiplier={ item.new_multiplier }
                isLoading={ isLoading }
              />
              <TimeWithTooltip
                timestamp={ item.effective_at }
                enableIncrement
                isLoading={ isLoading }
                color="text.secondary"
                display="inline-block"
              />
              { status ?
                <TokenMultiplierChangeStatusTag status={ status } isLoading={ isLoading }/> :
                <Skeleton loading={ isLoading } display="inline-block" color="text.secondary">N/A</Skeleton> }
            </React.Fragment>
          );
        }) }
      </Grid>
      { changesCount > INLINE_HISTORY_MAX_ITEMS && (
        <Link href={ viewAllUrl } textStyle="sm" variant="secondary" mt={ 2.5 } loading={ query.isPlaceholderData }>
          View all
        </Link>
      ) }
    </Box>
  ) : null;

  return (
    <CollapsibleDetails
      noScroll
      text={ [ 'View history', 'Hide history' ] }
      onClick={ handleToggle }
      variant="secondary"
      display="block"
      ml={ 3 }
    >
      { content }
    </CollapsibleDetails>
  );
};

export default React.memo(TokenMultiplierHistoryInline);
