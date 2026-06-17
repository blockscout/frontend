// SPDX-License-Identifier: LicenseRef-Blockscout

import { Separator, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ZilliqaNestedQuorumCertificate } from 'src/features/chain-variants/zilliqa/types/api';
import type { ExcludeUndefined } from 'src/shared/types/utils';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { AccordionRoot, AccordionItem, AccordionItemTrigger, AccordionItemContent } from 'src/toolkit/chakra/accordion';
import { Hint } from 'src/toolkit/components/Hint/Hint';
import { apos, ndash } from 'src/toolkit/utils/htmlEntities';

function formatSigners(signers: Array<number>) {
  return `[${ signers.join(', ') }]`;
}

interface Props {
  data: ExcludeUndefined<schemas['BlockResponse']['zilliqa']>['quorum_certificate'] & {
    nested_quorum_certificates?: Array<ZilliqaNestedQuorumCertificate>;
  };
}

const BlockDetailsZilliqaQuorumCertificate = ({ data }: Props) => {
  const hint = (isNested?: boolean) => (
    <>
      The iteration of the consensus round in which the block was proposed:<br/><br/>
      View { ndash } the view number of the quorum certificate, indicating the consensus round.<br/><br/>
      Signature { ndash } aggregated BLS signature representing the validators{ apos } agreement.<br/><br/>
      Signers { ndash } an array of integers representing the indices of validators who participated in the quorum (indicated by the cosigned bit vector).
      { isNested && (
        <>
          <br/><br/>
          Proposed by validator { ndash } validator index proposing the nested quorum certificate.
        </>
      ) }
    </>
  );

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ hint() }
      >
        { data.nested_quorum_certificates ? 'Aggregate quorum certificate' : 'Quorum certificate' }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue flexWrap="wrap">
        <Grid
          textStyle="sm"
          gridTemplateColumns="min-content 1fr"
          columnGap={ 5 }
          mt={{ base: 2, lg: 1.5 }}
        >
          <GridItem fontWeight={ 600 }>View</GridItem>
          <GridItem>{ data.view }</GridItem>
          <DetailedInfo.ItemDivider my={{ base: 2, lg: 2 }} colSpan={ 2 }/>
          <GridItem fontWeight={ 600 }>Signature</GridItem>
          <GridItem whiteSpace="pre-wrap" wordBreak="break-word" display="flex" alignItems="flex-start">
            { data.signature }
            <CopyToClipboard text={ data.signature }/>
          </GridItem>
          <DetailedInfo.ItemDivider my={{ base: 2, lg: 2 }} colSpan={ 2 }/>
          <GridItem fontWeight={ 600 }>Signers</GridItem>
          <GridItem whiteSpace="pre-wrap">{ formatSigners(data.signers) }</GridItem>
        </Grid>
        { data.nested_quorum_certificates && data.nested_quorum_certificates.length > 0 && (
          <>
            <Separator mt={ 2 } w="100%"/>
            <AccordionRoot
              multiple
              w="100%"
              textStyle="sm"
            >
              <AccordionItem
                value="nested-quorum-certificates"
                borderWidth={ 0 }
                _last={{ borderBottomWidth: 0 }}
              >
                <AccordionItemTrigger
                  textStyle="sm"
                  fontWeight={ 600 }
                >
                  <span>Nested quorum certificates</span>
                  <Hint label={ hint(true) }/>
                </AccordionItemTrigger>
                <AccordionItemContent display="flex" flexDirection="column" rowGap={ 2 } p={ 0 }>
                  { data.nested_quorum_certificates?.map((item, index) => (
                    <Grid
                      key={ index }
                      gridTemplateColumns="90px minmax(0, 1fr)"
                      columnGap={ 3 }
                      rowGap={ 2 }
                      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
                      p={ 4 }
                      borderRadius="md"
                      _first={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
                    >
                      <GridItem>View</GridItem>
                      <GridItem>{ item.view }</GridItem>
                      <GridItem>Signature</GridItem>
                      <GridItem whiteSpace="pre-wrap" wordBreak="break-word" display="flex" alignItems="flex-start">
                        { item.signature }
                        <CopyToClipboard text={ item.signature }/>
                      </GridItem>
                      <GridItem>Signers</GridItem>
                      <GridItem whiteSpace="pre-wrap">{ formatSigners(item.signers) }</GridItem>
                      <GridItem whiteSpace="pre-wrap">Proposed by validator</GridItem>
                      <GridItem >{ item.proposed_by_validator_index }</GridItem>
                    </Grid>
                  )) }
                </AccordionItemContent>
              </AccordionItem>
            </AccordionRoot>
          </>
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlockDetailsZilliqaQuorumCertificate);
