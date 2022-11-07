import { Hide, Show, Text } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransferResponse } from 'types/api/tokenTransfer';
import type { QueryKeys } from 'types/client/queries';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonTable from 'ui/shared/SkeletonTable';
import { flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferSkeletonMobile from 'ui/shared/TokenTransfer/TokenTransferSkeletonMobile';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';

interface Props {
  isLoading?: boolean;
  isDisabled?: boolean;
  path: string;
  queryName: QueryKeys;
  queryIds?: Array<string>;
  baseAddress?: string;
  showTxInfo?: boolean;
}

const TokenTransfer = ({ isLoading: isLoadingProp, isDisabled, queryName, queryIds, path, baseAddress, showTxInfo = true }: Props) => {
  const { isError, isLoading, data, pagination } = useQueryWithPages<TokenTransferResponse>({
    apiPath: path,
    queryName,
    queryIds,
    options: { enabled: !isDisabled },
  });

  const content = (() => {
    if (isLoading || isLoadingProp) {
      return (
        <>
          <Hide below="lg">
            <SkeletonTable columns={ showTxInfo ?
              [ '44px', '185px', '160px', '25%', '25%', '25%', '25%' ] :
              [ '185px', '25%', '25%', '25%', '25%' ] }
            />
          </Hide>
          <Show below="lg">
            <TokenTransferSkeletonMobile showTxInfo={ showTxInfo }/>
          </Show>
        </>
      );
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    if (!data.items?.length) {
      return <Text as="span">There are no token transfers</Text>;
    }

    const items = data.items.reduce(flattenTotal, []);
    return (
      <>
        <Hide below="lg">
          <TokenTransferTable data={ items } baseAddress={ baseAddress } showTxInfo={ showTxInfo }/>
        </Hide>
        <Show below="lg">
          <TokenTransferList data={ items } baseAddress={ baseAddress } showTxInfo={ showTxInfo }/>
        </Show>
      </>
    );
  })();

  return (
    <>
      <ActionBar>
        <Pagination ml="auto" { ...pagination }/>
      </ActionBar>
      { content }
    </>
  );
};

export default React.memo(TokenTransfer);
