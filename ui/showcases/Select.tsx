import { createListCollection } from '@chakra-ui/react';
import { noop } from 'es-toolkit';
import React from 'react';

import { NativeSelectField, NativeSelectRoot } from 'toolkit/chakra/native-select';
import { SelectContent, SelectItem, SelectRoot, SelectControl, SelectValueText } from 'toolkit/chakra/select';
import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';
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

// TODO @tom2drum + tanya: select with search

const SelectShowcase = () => {
  const [ hasActiveFilter, setHasActiveFilter ] = React.useState(false);

  const handleFilterChange = React.useCallback((nextValue: string) => {
    setHasActiveFilter(nextValue !== txSortingOptions.items[0].value);
  }, []);

  return (
    <Container value="select">
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
        <SectionSubHeader>Native select</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <NativeSelectRoot>
              <NativeSelectField>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>Sort</SectionSubHeader>
        <SamplesStack>
          <Sample>
            <Sort
              name="transactions_sorting"
              defaultValue={ [ txSortingOptions.items[0].value ] }
              collection={ txSortingOptions }
              w="fit-content"
            />
            <Sort
              name="transactions_sorting"
              defaultValue={ [ txSortingOptions.items[0].value ] }
              collection={ txSortingOptions }
              isLoading
              w="fit-content"
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

        <SectionSubHeader>Radio filter</SectionSubHeader>
        <SamplesStack>
          <Sample flexWrap="nowrap">
            <PopoverFilterRadio
              name="transactions_sorting"
              collection={ txSortingOptions }
              hasActiveFilter={ hasActiveFilter }
              onChange={ handleFilterChange }
            />
            <PopoverFilterRadio
              name="transactions_sorting"
              collection={ txSortingOptions }
              hasActiveFilter
              onChange={ noop }
              isLoading
            />
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(SelectShowcase);
