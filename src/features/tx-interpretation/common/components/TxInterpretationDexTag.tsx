// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TxInterpretationVariableDex } from 'src/features/tx-interpretation/common/types/api';

import config from 'src/config';
import { route } from 'src/shared/router/routes';

import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';

type DexTagValue = TxInterpretationVariableDex['value'];

interface NameProps {
  readonly value: DexTagValue;
  readonly noLink: boolean | undefined;
}

const DexTagName = ({ value, noLink }: NameProps) => {
  if (noLink) {
    return value.name;
  }

  if (value.app_id && config.features.marketplace.isEnabled) {
    return (
      <Link
        href={ route({ pathname: '/apps/[id]', query: { id: value.app_id } }) }
      >
        { value.name }
      </Link>
    );
  }

  if (value.url) {
    return (
      <Link external href={ value.url }>
        { value.name }
      </Link>
    );
  }

  return value.name;
};

interface Props extends HTMLChakraProps<'span'> {
  readonly value: DexTagValue;
  readonly noLink?: boolean;
}

const TxInterpretationDexTag = ({ value, noLink, ...rest }: Props) => {
  const icon = value.app_icon || value.icon;

  return (
    <chakra.span display="inline-flex" alignItems="center" gap={ 1 } { ...rest }>
      { icon && <Image src={ icon } alt={ value.name } width={ 5 } height={ 5 }/> }
      <DexTagName value={ value } noLink={ noLink }/>
    </chakra.span>
  );
};

export default TxInterpretationDexTag;
