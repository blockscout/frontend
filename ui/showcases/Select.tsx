import { createListCollection } from '@chakra-ui/react';
import { noop } from 'es-toolkit';
import React from 'react';

import { SelectContent, SelectItem, SelectRoot, SelectControl, SelectValueText } from 'toolkit/chakra/select';
import Sort from 'ui/shared/sort/Sort';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import { SORT_OPTIONS } from 'ui/txs/useTxsSort';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const frameworks = createListCollection({
  items: [
    { label: 'React.js', value: 'react' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
  ],
});
const txSortingOptions = createListCollection({
  items: SORT_OPTIONS,
});

const SelectsShowcase = () => {

  return (
    <Container value="selects">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack>
          <Sample label="variant: outline">
            <SelectRoot collection={ frameworks } variant="outline" defaultValue={ [ frameworks.items[0].value ] }>
              <SelectControl w="200px">
                <SelectValueText placeholder="Select framework"/>
              </SelectControl>
              <SelectContent>
                { frameworks.items.map((framework) => (
                  <SelectItem item={ framework } key={ framework.value }>
                    { framework.label }
                  </SelectItem>
                )) }
              </SelectContent>
            </SelectRoot>
          </Sample>
          <Sample label="variant: filter">
            <SelectRoot collection={ frameworks } variant="filter" multiple>
              <SelectControl w="200px">
                <SelectValueText placeholder="Select framework"/>
              </SelectControl>
              <SelectContent>
                { frameworks.items.map((framework) => (
                  <SelectItem item={ framework } key={ framework.value }>
                    { framework.label }
                  </SelectItem>
                )) }
              </SelectContent>
            </SelectRoot>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Examples</SectionHeader>
        <SectionSubHeader>Sort</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <Sort
              name="transactions_sorting"
              defaultValue={ [ txSortingOptions.items[0].value ] }
              collection={ txSortingOptions }
            />
            <Sort
              name="transactions_sorting"
              defaultValue={ [ txSortingOptions.items[0].value ] }
              collection={ txSortingOptions }
              isLoading
            />
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Token transfers filter</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <TokenTransferFilter defaultTypeFilters={ [ ] } onTypeFilterChange={ noop } withAddressFilter/>
            <TokenTransferFilter defaultTypeFilters={ [ ] } onTypeFilterChange={ noop } appliedFiltersNum={ 2 }/>
            <TokenTransferFilter defaultTypeFilters={ [ ] } onTypeFilterChange={ noop } appliedFiltersNum={ 2 } isLoading/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(SelectsShowcase);
