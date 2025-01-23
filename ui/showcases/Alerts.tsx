import { Box, Table } from '@chakra-ui/react';
import React from 'react';

import { Alert } from 'toolkit/chakra/alert';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const AlertsShowcase = () => {
  return (
    <Container value="alerts">
      <Section>
        <SectionHeader>Status</SectionHeader>
        <SamplesStack>
          <Sample label="visual: info">
            <Alert visual="info" title="Info"> Alert content </Alert>
          </Sample>
          <Sample label="visual: neutral">
            <Alert visual="neutral" title="Neutral"> Alert content </Alert>
          </Sample>
          <Sample label="visual: warning">
            <Alert visual="warning" title="Warning"> Alert content </Alert>
          </Sample>
          <Sample label="visual: success">
            <Alert visual="success" title="Success"> Alert content </Alert>
          </Sample>
          <Sample label="visual: error">
            <Alert visual="error" title="Error"> Alert content </Alert>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack>
          <Sample label="variant: subtle">
            <Alert visual="info" title="Info"> Alert content </Alert>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Examples</SectionHeader>
        <SectionSubHeader>Inside table (SocketNewItemsNotice)</SectionSubHeader>
        <SamplesStack>
          <Sample label="loading">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader w="100px">Block</Table.ColumnHeader>
                  <Table.ColumnHeader w="100px">Age</Table.ColumnHeader>
                  <Table.ColumnHeader w="100px">Gas used</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <SocketNewItemsNotice.Desktop
                  url={ window.location.href }
                  num={ 1234 }
                  type="block"
                  isLoading
                />
              </Table.Body>
            </Table.Root>
          </Sample>
          <Sample label="success">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader w="100px">Block</Table.ColumnHeader>
                  <Table.ColumnHeader w="100px">Age</Table.ColumnHeader>
                  <Table.ColumnHeader w="100px">Gas used</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <SocketNewItemsNotice.Desktop
                  url={ window.location.href }
                  num={ 1234 }
                  type="block"
                  isLoading={ false }
                />
              </Table.Body>
            </Table.Root>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Multiple lines</SectionSubHeader>
        <SamplesStack>
          <Sample label="multiple lines, with title, inline=false">
            <Alert visual="warning" title="Warning" inline={ false } maxWidth="500px">
              <Box>
                Participated in our recent Blockscout activities? Check your eligibility and claim your NFT Scout badges. More exciting things are coming soon!
              </Box>
            </Alert>
          </Sample>
          <Sample label="multiple lines, no title">
            <Alert visual="warning" maxWidth="500px">
              <Box>
                Participated in our recent Blockscout activities? Check your eligibility and claim your NFT Scout badges. More exciting things are coming soon!
              </Box>
            </Alert>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(AlertsShowcase);
