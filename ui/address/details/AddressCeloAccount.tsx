import { Grid, GridItem } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { upperFirst } from 'es-toolkit';
import React from 'react';

import type { Address } from 'types/api/address';
import type { ExcludeNull, ExcludeUndefined } from 'types/utils';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import { Link } from 'toolkit/chakra/link';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  isLoading?: boolean;
  data: ExcludeNull<ExcludeUndefined<Address['celo']>['account']>;
}

const AddressCeloAccount = ({ isLoading, data }: Props) => {
  const hint = (
    <>
      Celo account info (from the Accounts contract){ data.name ? ', including it\'s human-readable name and' : '' }:<br/><br/>
      Type – the role of the account: regular, validator, or validator group.<br/><br/>
      { data.metadata_url ? <>Metadata URL – link to additional information published by the account owner.<br/><br/></> : null }
      Locked CELO – total amount of CELO locked by this account (used for staking or governance).<br/><br/>
      Non-voting Locked CELO – portion of locked CELO that is not currently used for voting.<br/><br/>
    </>
  );

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ hint }
        hintProps={{
          tooltipProps: {
            contentProps: {
              textAlign: 'left',
            },
          },
        }}
        isLoading={ isLoading }
      >
        Celo account
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        { data.name && <TruncatedValue value={ data.name } mr={ 3 }/> }
        <CollapsibleDetails noScroll variant="secondary" display="block" textStyle={ undefined } fontSize="sm" loading={ isLoading }>
          <Grid
            gridTemplateColumns="max-content minmax(0px, 1fr)"
            textStyle="sm"
            bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
            w="100%"
            px="18px"
            py={ 3 }
            mt={ 1 }
            columnGap={ 3 }
            rowGap={ 4 }
            borderBottomRightRadius="base"
            borderBottomLeftRadius="base"
          >
            <GridItem color="text.secondary">Type</GridItem>
            <GridItem>{ upperFirst(data.type) }</GridItem>
            { data.metadata_url && (
              <>
                <GridItem color="text.secondary">Metadata URL</GridItem>
                <Link href={ data.metadata_url } external>
                  <TruncatedValue value={ data.metadata_url }/>
                </Link>
              </>
            ) }
            <GridItem color="text.secondary">Locked { currencyUnits.ether }</GridItem>
            <TruncatedValue value={ BigNumber(data.locked_celo).div(10 ** config.chain.currency.decimals).toFormat() }/>
            <GridItem color="text.secondary">Non-voting locked { currencyUnits.ether }</GridItem>
            <TruncatedValue value={ BigNumber(data.nonvoting_locked_celo).div(10 ** config.chain.currency.decimals).toFormat() }/>
          </Grid>
        </CollapsibleDetails>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(AddressCeloAccount);
