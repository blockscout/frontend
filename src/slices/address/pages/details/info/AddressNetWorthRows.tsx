// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressMultichainNetWorth from 'src/features/multichain-portfolio/pages/address/AddressMultichainNetWorth';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import AddressNetWorth from './AddressNetWorth';

const isPortfolioEnabled = config.features.multichainPortfolio.isEnabled;
const isMultichainButtonEnabled = config.features.multichainButton.isEnabled;

interface Props {
  data: schemas['AddressResponse'];
  addressData: schemas['AddressResponse'] | undefined;
  addressHash: string;
  isLoading: boolean;
}

const AddressNetWorthRows = ({ data, addressData, addressHash, isLoading }: Props) => {
  const isEip7702 = Boolean(addressData?.implementations?.length) && addressData?.proxy_type === 'eip7702';
  const hasMultichainButtons = isMultichainButtonEnabled && (!addressData?.is_contract || isEip7702);

  const hasChainNetWorth = Boolean(data.exchange_rate && data.has_tokens);
  const hasNetWorthRow = hasChainNetWorth || (!isPortfolioEnabled && isMultichainButtonEnabled);

  return (
    <>
      { hasNetWorthRow && (
        <>
          <DetailedInfo.ItemLabel
            hint="Total net worth in USD of all tokens for the address"
            isLoading={ isLoading }
          >
            Net worth
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow>
            <AddressNetWorth
              addressData={ addressData }
              addressHash={ addressHash }
              isLoading={ isLoading }
              hasMultichainButtons={ hasMultichainButtons && !isPortfolioEnabled }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
      { isPortfolioEnabled && (
        <AddressMultichainNetWorth
          addressHash={ addressHash }
          hasMultichainButtons={ hasMultichainButtons }
          isLoading={ isLoading }
        />
      ) }
    </>
  );
};

export default React.memo(AddressNetWorthRows);
