// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import TextAd from 'src/features/ads/text/components/TextAd';
import ValidatorEntity from 'src/features/chain-variants/zilliqa/components/ValidatorEntity';
import { VALIDATOR_ZILLIQA } from 'src/features/chain-variants/zilliqa/stubs/validators';

import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import ValidatorDetails from './ValidatorDetails';

const ValidatorZilliqa = () => {
  const router = useRouter();
  const blsPublicKey = getQueryParamString(router.query.id);

  const query = useApiQuery('general:validator_zilliqa', {
    pathParams: { bls_public_key: blsPublicKey },
    queryOptions: {
      placeholderData: VALIDATOR_ZILLIQA,
    },
  });

  throwOnResourceLoadError(query);

  const isLoading = query.isPlaceholderData;

  const titleSecondRow = (
    <Flex
      columnGap={ 3 }
      rowGap={ 3 }
      alignItems="center"
      w="100%"
      flexWrap={{ base: 'wrap', lg: 'nowrap' }}
    >
      <ValidatorEntity
        id={ query.data?.bls_public_key ?? '' }
        isLoading={ isLoading }
        variant="subheading"
        noLink
      />
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle title="Validator details" secondRow={ titleSecondRow }/>
      { query.data && <ValidatorDetails data={ query.data } isLoading={ isLoading }/> }
    </>
  );
};

export default ValidatorZilliqa;
