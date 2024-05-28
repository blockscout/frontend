import { Text, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import { WEI, WEI_IN_GWEI, ZERO } from 'lib/consts';
import { space } from 'lib/html-entities';
import { currencyUnits } from 'lib/units';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
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
  const blobFees = BigNumber(data.blob_gas_price || 0).multipliedBy(BigNumber(data.blob_gas_used || 0));

  return (
    <>

      { data.blob_gas_price && (
        <>
          <DetailsInfoItem.Label
            // eslint-disable-next-line max-len
            hint="Price per unit of gas used for for blob deployment. Blob gas is independent of normal gas. Both gas prices can affect the priority of transaction execution."
          >
            Blob gas price
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Text>{ BigNumber(data.blob_gas_price).dividedBy(WEI).toFixed() } { currencyUnits.ether } </Text>
            <Text variant="secondary" whiteSpace="pre">
              { space }({ BigNumber(data.blob_gas_price).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })
            </Text>
          </DetailsInfoItem.Value>
        </>
      ) }
      { data.blob_gas_used && (
        <>
          <DetailsInfoItem.Label
            hint="Actual amount of gas used by the blobs in this block"
          >
            Blob gas used
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Text>{ BigNumber(data.blob_gas_used).toFormat() }</Text>
          </DetailsInfoItem.Value>
        </>
      ) }
      { !burntBlobFees.isEqualTo(ZERO) && (
        <>
          <DetailsInfoItem.Label
            hint={ `Amount of ${ currencyUnits.ether } used for blobs in this block` }
          >
            Blob burnt fees
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <IconSvg name="flame" boxSize={ 5 } color="gray.500" mr={ 2 }/>
            { burntBlobFees.dividedBy(WEI).toFixed() } { currencyUnits.ether }
            { !blobFees.isEqualTo(ZERO) && (
              <Tooltip label="Blob burnt fees / Txn fees * 100%">
                <div>
                  <Utilization ml={ 4 } value={ burntBlobFees.dividedBy(blobFees).toNumber() }/>
                </div>
              </Tooltip>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }
      { data.excess_blob_gas && (
        <>
          <DetailsInfoItem.Label
            hint="A running total of blob gas consumed in excess of the target, prior to the block."
          >
            Excess blob gas
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Text>{ BigNumber(data.excess_blob_gas).dividedBy(WEI).toFixed() } { currencyUnits.ether } </Text>
            <Text variant="secondary" whiteSpace="pre">
              { space }({ BigNumber(data.excess_blob_gas).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })
            </Text>
          </DetailsInfoItem.Value>
        </>
      ) }
      <DetailsInfoItemDivider/>
    </>
  );
};

export default React.memo(BlockDetailsBlobInfo);
