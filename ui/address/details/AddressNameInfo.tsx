import { Skeleton } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { Address } from 'types/api/address';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  data: Pick<Address, 'name' | 'token' | 'is_contract'>;
  isLoading: boolean;
}

const AddressNameInfo = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');

  if (data.token) {
    return (
      <DetailsInfoItem
        title={ t('address_area.Token_name') }
        hint={ t('address_area.Token_name_and_symbol') }
        isLoading={ isLoading }
      >
        <TokenEntity
          token={ data.token }
          isLoading={ isLoading }
          noIcon
          noCopy
        />
      </DetailsInfoItem>
    );
  }

  if (data.is_contract && data.name) {
    return (
      <DetailsInfoItem
        title={ t('address_area.Contract_name') }
        hint={ t('address_area.The_name_found_in_the_source_code_of_the_Contract') }
        isLoading={ isLoading }
      >
        <Skeleton isLoaded={ !isLoading }>
          { data.name }
        </Skeleton>
      </DetailsInfoItem>
    );
  }

  if (data.name) {
    return (
      <DetailsInfoItem
        title={ t('address_area.Validator_name') }
        hint={ t('address_area.The_name_of_the_validator') }
        isLoading={ isLoading }
      >
        <Skeleton isLoaded={ !isLoading }>
          { data.name }
        </Skeleton>
      </DetailsInfoItem>
    );
  }

  return null;
};

export default React.memo(AddressNameInfo);
