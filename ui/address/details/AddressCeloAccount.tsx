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
import { Hint } from 'toolkit/components/Hint/Hint';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TruncatedValue from 'ui/shared/TruncatedValue';

const AddressCeloAccountItem = ({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) => {
  return (
    <>
      <GridItem color="text.secondary" display="flex" alignItems="center">
        <Hint label={ hint } boxSize={ 4 } mr={ 1 }/>
        <TruncatedValue value={ label } maxW={{ base: '130px', lg: 'unset' }}/>
      </GridItem>
      { children }
    </>
  );
};

interface Props {
  isLoading?: boolean;
  data: ExcludeNull<ExcludeUndefined<Address['celo']>['account']>;
}

const AddressCeloAccount = ({ isLoading, data }: Props) => {
  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Celo account info (from the Accounts contract), including it's human-readable name"
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
            p={{ base: 2, lg: 3 }}
            mt={ 1 }
            columnGap={ 3 }
            rowGap={ 4 }
            borderBottomRightRadius="base"
            borderBottomLeftRadius="base"
          >
            <AddressCeloAccountItem label="Type" hint="The role of the account: regular, validator, or validator group">
              { upperFirst(data.type) }
            </AddressCeloAccountItem>

            { data.metadata_url && (
              <AddressCeloAccountItem label="Metadata URL" hint="Link to additional information published by the account owner">
                <Link href={ data.metadata_url } external>
                  <TruncatedValue value={ data.metadata_url }/>
                </Link>
              </AddressCeloAccountItem>
            ) }

            <AddressCeloAccountItem
              label={ `Locked ${ currencyUnits.ether }` }
              hint="Total amount of CELO locked by this account (used for staking or governance)"
            >
              <TruncatedValue value={ BigNumber(data.locked_celo).div(10 ** config.chain.currency.decimals).toFormat() }/>
            </AddressCeloAccountItem>

            <AddressCeloAccountItem
              label={ `Non-voting locked ${ currencyUnits.ether }` }
              hint="Portion of locked CELO that is not currently used for voting"
            >
              <TruncatedValue value={ BigNumber(data.nonvoting_locked_celo).div(10 ** config.chain.currency.decimals).toFormat() }/>
            </AddressCeloAccountItem>

            { data.vote_signer_address && (
              <AddressCeloAccountItem
                label="Vote signer address"
                hint="Address authorized to vote in governance and validator elections on behalf of this account"
              >
                <AddressEntity address={ data.vote_signer_address }/>
              </AddressCeloAccountItem>
            ) }

            { data.validator_signer_address && (
              <AddressCeloAccountItem
                label="Validator signer address"
                hint="Address authorized to manage a validator or validator group and sign consensus messages for this account"
              >
                <AddressEntity address={ data.validator_signer_address }/>
              </AddressCeloAccountItem>
            ) }

            { data.attestation_signer_address && (
              <AddressCeloAccountItem
                label="Attestation signer address"
                hint="Address whose key this account uses to sign attestations on the Attestations contract"
              >
                <AddressEntity address={ data.attestation_signer_address }/>
              </AddressCeloAccountItem>
            ) }
          </Grid>
        </CollapsibleDetails>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(AddressCeloAccount);
