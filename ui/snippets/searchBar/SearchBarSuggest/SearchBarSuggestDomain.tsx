import { Grid, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultDomain } from 'types/api/search';

import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  data: SearchResultDomain;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestDomain = ({ data, isMobile, searchTerm }: Props) => {
  const icon = <IconSvg name="ENS_slim" boxSize={ 5 } color="gray.500"/>;

  const name = (
    <Text
      fontWeight={ 700 }
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.ens_info.name, searchTerm) }}/>
    </Text>
  );

  const address = (
    <Text
      overflow="hidden"
      whiteSpace="nowrap"
      variant="secondary"
    >
      <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
    </Text>
  );

  const isContractVerified = data.is_smart_contract_verified && <IconSvg name="status/success" boxSize="14px" color="green.500" flexShrink={ 0 }/>;

  const expiresText = data.ens_info?.expiry_date ? ` expires ${ dayjs(data.ens_info.expiry_date).fromNow() }` : '';
  const ensNamesCount = data?.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }`;
  const additionalInfo = (
    <Text variant="secondary" textAlign={ isMobile ? 'start' : 'end' }>
      { data?.ens_info.names_count > 1 ? ensNamesCount : expiresText }
    </Text>
  );

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center" overflow="hidden" gap={ 2 }>
          { icon }
          { name }
        </Flex>
        <Flex alignItems="center" overflow="hidden" gap={ 1 }>
          { address }
          { isContractVerified }
        </Flex>
        { additionalInfo }
      </>
    );
  }

  return (
    <Grid alignItems="center" gridTemplateColumns="228px minmax(auto, max-content) auto" gap={ 2 }>
      <Flex alignItems="center" gap={ 2 }>
        { icon }
        { name }
      </Flex>
      <Flex alignItems="center" overflow="hidden" gap={ 1 }>
        { address }
        { isContractVerified }
      </Flex>
      { additionalInfo }
    </Grid>
  );
};

export default React.memo(SearchBarSuggestDomain);
