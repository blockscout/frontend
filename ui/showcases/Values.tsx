import BigNumber from 'bignumber.js';
import React from 'react';

import AssetValue from 'ui/shared/value/AssetValue';
import SimpleValue from 'ui/shared/value/SimpleValue';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const ValuesShowcase = () => {
  return (
    <Container value="values">
      <Section>
        <SectionHeader>SimpleValue</SectionHeader>
        <SectionSubHeader>Basic examples</SectionSubHeader>
        <SamplesStack>
          <Sample label="Big value">
            <SimpleValue
              value={ BigNumber('1000000000000000000000000') }
              startElement="Get your "
              endElement=" DUCK now!"
              maxW="400px"
            />
          </Sample>
          <Sample label="Small value">
            <SimpleValue
              value={ BigNumber(1).div('1000000000000000000') }
              prefix="$"
              maxW="400px"
            />
          </Sample>
          <Sample label="No accuracy">
            <SimpleValue
              value={ BigNumber(1).div('1000000000000000000') }
              accuracy={ 0 }
              startElement="Get your "
              endElement=" DUCK now!"
              maxW="400px"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Overflowed</SectionSubHeader>
        <SamplesStack>
          <Sample label="Big value">
            <SimpleValue
              value={ BigNumber('1000000000000000000000000') }
              endElement="ETH"
              overflowed
              maxW="200px"
            />
          </Sample>
          <Sample label="Small value">
            <SimpleValue
              value={ BigNumber(1).div('1000000000000000000') }
              prefix="$"
              overflowed
              maxW="200px"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Loading</SectionSubHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <SimpleValue
              loading
              value={ BigNumber('1000000000000000000000000') }
              startElement="Get your "
              endElement=" DUCK now!"
              maxW="400px"
            />
          </Sample>
        </SamplesStack>

      </Section>

      <Section>
        <SectionHeader>ValueWithUsd</SectionHeader>
        <SectionSubHeader>Layout</SectionSubHeader>
        <SamplesStack>
          <Sample label="horizontal">
            <AssetValue
              amount="1000000000000000000000000"
              asset="DUCK"
              decimals="6"
              exchangeRate="4200"
              maxW="400px"
            />
          </Sample>
          <Sample label="vertical">
            <AssetValue
              amount="1000000000000000000000000"
              asset="DUCK"
              decimals="6"
              exchangeRate="4200"
              maxW="250px"
              layout="vertical"
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Loading</SectionSubHeader>
        <SamplesStack>
          <Sample label="loading: true">
            <AssetValue
              amount="1000000000000000000000000"
              asset="DUCK"
              decimals="6"
              exchangeRate="4200"
              maxW="400px"
              loading
            />
            <AssetValue
              amount="1000000000000000000000000"
              asset="DUCK"
              decimals="6"
              exchangeRate="4200"
              maxW="300px"
              layout="vertical"
              loading
            />
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(ValuesShowcase);
