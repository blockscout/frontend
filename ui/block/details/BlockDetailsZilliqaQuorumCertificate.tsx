import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Divider, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { ZilliqaNestedQuorumCertificate, ZilliqaQuorumCertificate } from 'types/api/block';

import { apos, ndash } from 'lib/html-entities';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import Hint from 'ui/shared/Hint';

function formatSigners(signers: Array<number>) {
  return `[${ signers.join(', ') }]`;
}

interface Props {
  data: ZilliqaQuorumCertificate & {
    nested_quorum_certificates?: Array<ZilliqaNestedQuorumCertificate>;
  };
}

const BlockDetailsZilliqaQuorumCertificate = ({ data }: Props) => {
  const nestedBlockBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

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
      <DetailsInfoItem.Label
        hint={ hint() }
      >
        { data.nested_quorum_certificates ? 'Aggregate quorum certificate' : 'Quorum certificate' }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value rowGap={ 0 }>
        <Grid
          fontSize="sm"
          lineHeight={ 5 }
          gridTemplateColumns="min-content 1fr"
          columnGap={ 5 }
        >
          <GridItem fontWeight={ 600 }>View</GridItem>
          <GridItem>{ data.view }</GridItem>
          <DetailsInfoItemDivider my={{ base: 2, lg: 2 }} colSpan={ 2 }/>
          <GridItem fontWeight={ 600 }>Signature</GridItem>
          <GridItem whiteSpace="pre-wrap" wordBreak="break-word" display="flex" alignItems="flex-start" columnGap={ 5 }>
            { data.signature }
            <CopyToClipboard text={ data.signature }/>
          </GridItem>
          <DetailsInfoItemDivider my={{ base: 2, lg: 2 }} colSpan={ 2 }/>
          <GridItem fontWeight={ 600 }>Signers</GridItem>
          <GridItem >{ formatSigners(data.signers) }</GridItem>
        </Grid>
        { data.nested_quorum_certificates && data.nested_quorum_certificates.length > 0 && (
          <>
            <Divider my={ 2 }/>
            <Accordion
              allowToggle
              w="100%"
              fontSize="sm"
              lineHeight={ 5 }
            >
              <AccordionItem borderWidth={ 0 } _last={{ borderBottomWidth: 0 }}>
                { ({ isExpanded }) => (
                  <>
                    <AccordionButton
                      fontSize="sm"
                      lineHeight={ 5 }
                      fontWeight={ 600 }
                      display="flex"
                      alignItems="center"
                      columnGap={ 1 }
                      px={ 0 }
                      pt={ 0 }
                      pb={ 2 }
                      _hover={{ bgColor: 'inherit' }}
                    >
                      <span>Nested quorum certificates</span>
                      <Hint label={ hint(true) }/>
                      <AccordionIcon flexShrink={ 0 } boxSize={ 5 } transform={ isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' } color="gray.500"/>
                    </AccordionButton>
                    <AccordionPanel display="flex" flexDirection="column" rowGap={ 2 } p={ 0 }>
                      { data.nested_quorum_certificates?.map((item, index) => (
                        <Grid
                          key={ index }
                          gridTemplateColumns="90px 1fr"
                          columnGap={ 3 }
                          rowGap={ 2 }
                          bgColor={ nestedBlockBgColor }
                          p={ 4 }
                          borderRadius="md"
                          _first={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
                        >
                          <GridItem>View</GridItem>
                          <GridItem>{ item.view }</GridItem>
                          <GridItem>Signature</GridItem>
                          <GridItem whiteSpace="pre-wrap" wordBreak="break-word" display="flex" alignItems="flex-start" columnGap={ 3 }>
                            { item.signature }
                            <CopyToClipboard text={ item.signature }/>
                          </GridItem>
                          <GridItem>Signers</GridItem>
                          <GridItem >{ formatSigners(item.signers) }</GridItem>
                          <GridItem whiteSpace="pre-wrap">Proposed by validator</GridItem>
                          <GridItem >{ item.proposed_by_validator_index }</GridItem>
                        </Grid>
                      )) }
                    </AccordionPanel>
                  </>
                ) }
              </AccordionItem>
            </Accordion>
          </>
        ) }
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(BlockDetailsZilliqaQuorumCertificate);
