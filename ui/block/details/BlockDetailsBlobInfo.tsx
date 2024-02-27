import { Text, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import { WEI, WEI_IN_GWEI, ZERO } from 'lib/consts';
import { space } from 'lib/html-entities';
import { currencyUnits } from 'lib/units';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import IconSvg from 'ui/shared/IconSvg';
import Utilization from 'ui/shared/Utilization/Utilization';

interface Props {
  data: Block;
}

const BlockDetailsBlobInfo = ({ data }: Props) => {
  if (
    !data.blob_gas_price ||
    !data.blob_gas_used ||
    !data.burnt_blob_fees ||
    !data.excess_blob_gas
  ) {
    return null;
  }

  const burntBlobFees = BigNumber(data.burnt_blob_fees || 0);
  const txFees = BigNumber(data.tx_fees || 0);

  return (
    <>

      { data.blob_gas_price && (
        <DetailsInfoItem
          title="Blob gas price"
          hint="Blob gas price"
        >
          <Text>{ BigNumber(data.blob_gas_price).dividedBy(WEI).toFixed() } { currencyUnits.ether } </Text>
          <Text variant="secondary" whiteSpace="pre">
            { space }({ BigNumber(data.blob_gas_price).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })
          </Text>
        </DetailsInfoItem>
      ) }
      { data.blob_gas_used && (
        <DetailsInfoItem
          title="Blob gas used"
          hint="Blob gas used"
        >
          <Text>{ BigNumber(data.blob_gas_used).toFormat() }</Text>
        </DetailsInfoItem>
      ) }
      { !burntBlobFees.isEqualTo(ZERO) && (
        <DetailsInfoItem
          title="Blob burnt fees"
          hint="Blob burnt fees"
        >
          <IconSvg name="flame" boxSize={ 5 } color="gray.500" mr={ 2 }/>
          { burntBlobFees.dividedBy(WEI).toFixed() } { currencyUnits.ether }
          { !txFees.isEqualTo(ZERO) && (
            <Tooltip label="Blob burnt fees / Txn fees * 100%">
              <div>
                <Utilization ml={ 4 } value={ burntBlobFees.dividedBy(txFees).toNumber() }/>
              </div>
            </Tooltip>
          ) }
        </DetailsInfoItem>
      ) }
      { data.excess_blob_gas && (
        <DetailsInfoItem
          title="Excess blob gas"
          hint="Excess blob gas"
        >
          <Text>{ BigNumber(data.excess_blob_gas).dividedBy(WEI).toFixed() } { currencyUnits.ether } </Text>
          <Text variant="secondary" whiteSpace="pre">
            { space }({ BigNumber(data.excess_blob_gas).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })
          </Text>
        </DetailsInfoItem>
      ) }
      <DetailsInfoItemDivider/>
    </>
  );
};

export default React.memo(BlockDetailsBlobInfo);
