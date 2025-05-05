import { chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { stripTrailingSlash } from 'toolkit/utils/url';

import * as TxEntity from './TxEntity';

const tacFeature = config.features.tac;

const TxEntityTon = (props: TxEntity.EntityProps) => {
  if (!tacFeature.isEnabled) {
    return null;
  }

  const defaultHref = `${ stripTrailingSlash(tacFeature.explorerUrl) }/tx/${ props.hash }`;

  return <TxEntity.default { ...props } href={ props.href ?? defaultHref } icon={{ name: 'brands/ton' }} isExternal/>;
};

export default chakra(TxEntityTon);
