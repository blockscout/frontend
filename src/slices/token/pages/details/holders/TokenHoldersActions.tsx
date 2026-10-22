// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import CsvExport from 'src/features/csv-export/components/CsvExport';

import Pagination from 'src/shared/pagination/Pagination';

import type { TokenHoldersQuery } from './useTokenHoldersQuery';

interface Props {
  token: schemas['Token'] | undefined;
  query: TokenHoldersQuery;
}

const TokenHoldersActions = ({ token, query }: Props) => {
  return (
    <>
      { token && (
        <CsvExport
          type="token_holders"
          resourceName="core:token_csv_export_holders"
          pathParams={{ hash: token.address_hash }}
          extraParams={{ token_name: token.name || 'Unknown token' }}
          periodFilter={ false }
          loadingInitial={ query.pagination.isLoading }
        />
      ) }
      { query.pagination.isVisible && <Pagination ml="auto" { ...query.pagination }/> }
    </>
  );
};

export default React.memo(TokenHoldersActions);
