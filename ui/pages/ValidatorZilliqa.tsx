import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { VALIDATOR_ZILLIQA } from 'stubs/validators';
import TextAd from 'ui/shared/ad/TextAd';
import ValidatorEntity from 'ui/shared/entities/validator/ValidatorEntity';
import PageTitle from 'ui/shared/Page/PageTitle';
import ValidatorDetails from 'ui/validators/zilliqa/ValidatorDetails';

const ValidatorZilliqa = () => {
  const appProps = useAppContext();
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

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.endsWith('/validators');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to validators list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

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
      <PageTitle title="Validator details" secondRow={ titleSecondRow } backLink={ backLink }/>
      { query.data && <ValidatorDetails data={ query.data } isLoading={ isLoading }/> }
    </>
  );
};

export default ValidatorZilliqa;
