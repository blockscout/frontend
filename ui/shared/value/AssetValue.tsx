import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { Tag } from 'toolkit/chakra/tag';
import { thinsp } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';

import type { Params as CalculateUsdValueParams } from './calculateUsdValue';
import calculateUsdValue from './calculateUsdValue';
import SimpleValue from './SimpleValue';
import { DEFAULT_ACCURACY, DEFAULT_ACCURACY_USD } from './utils';

export interface Props extends Omit<BoxProps, 'prefix' | 'suffix'>, Omit<CalculateUsdValueParams, 'amount'> {
  amount: string | null | undefined;
  asset?: React.ReactNode;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  noTooltip?: boolean;
  loading?: boolean;
  layout?: 'horizontal' | 'vertical';
  tooltipContent?: React.ReactNode;
  historicExchangeRate?: string | null;
  hasExchangeRateToggle?: boolean;
}

const AssetValue = ({
  amount,
  asset,
  decimals,
  accuracy = DEFAULT_ACCURACY,
  accuracyUsd = DEFAULT_ACCURACY_USD,
  startElement,
  endElement,
  noTooltip,
  loading,
  exchangeRate,
  historicExchangeRate,
  hasExchangeRateToggle,
  layout = 'horizontal',
  tooltipContent,
  ...rest
}: Props) => {
  const hasHistoric = Boolean(historicExchangeRate);
  const hasCurrent = Boolean(exchangeRate);
  const hasToggle = hasHistoric && hasCurrent && hasExchangeRateToggle && amount !== '0';

  const [ showHistoric, setShowHistoric ] = React.useState(hasHistoric);

  React.useEffect(() => {
    setShowHistoric(hasHistoric);
  }, [ hasHistoric ]);

  const activeExchangeRate = showHistoric ? historicExchangeRate : exchangeRate;

  const handleToggle = React.useCallback(() => {
    if (hasToggle) {
      setShowHistoric(prev => !prev);
    }
  }, [ hasToggle ]);

  if (amount === null || amount === undefined) {
    return <chakra.span { ...rest }>-</chakra.span>;
  }

  const { valueBn, usdBn } = calculateUsdValue({ amount, decimals, accuracy, accuracyUsd, exchangeRate: activeExchangeRate });

  if (!activeExchangeRate) {
    return (
      <SimpleValue
        value={ valueBn }
        accuracy={ accuracy }
        startElement={ startElement }
        endElement={ endElement ?? (typeof asset === 'string' ? `${ thinsp }${ asset }` : asset) }
        tooltipContent={ tooltipContent }
        noTooltip={ noTooltip }
        loading={ loading }
        { ...rest }
      />
    );
  }

  const nativeValue = (
    <SimpleValue
      value={ valueBn }
      accuracy={ accuracy }
      startElement={ startElement }
      endElement={ endElement ?? (typeof asset === 'string' ? `${ thinsp }${ asset }` : asset) }
      tooltipContent={ tooltipContent }
      noTooltip={ noTooltip }
      loading={ loading }
    />
  );

  const clockIcon = showHistoric ? (
    <IconSvg name="clock-light" boxSize="14px" color="icon.secondary"/>
  ) : undefined;

  const tooltipAdditionalContent = showHistoric ? 'Estimated value on day of txn' : 'Current value';

  const usdValue = hasToggle ? (
    <Tag
      size="md"
      startElement={ clockIcon }
      onClick={ handleToggle }
      loading={ loading }
      variant="clickable"
    >
      <SimpleValue
        value={ usdBn }
        accuracy={ accuracyUsd }
        prefix="$"
        tooltipAdditionalContent={ tooltipAdditionalContent }
      />
    </Tag>
  ) : (
    <SimpleValue
      value={ usdBn }
      accuracy={ accuracyUsd }
      startElement={ layout === 'horizontal' ? <span>(</span> : undefined }
      prefix="$"
      endElement={ layout === 'horizontal' ? <span>)</span> : undefined }
      tooltipAdditionalContent={ tooltipAdditionalContent }
      loading={ loading }
      color="text.secondary"
    />
  );

  return (
    <chakra.span
      display="inline-flex"
      flexDirection={ layout === 'vertical' ? 'column' : 'row' }
      alignItems={ layout === 'vertical' ? 'flex-end' : 'center' }
      maxW="100%"
      columnGap={ 1 }
      rowGap={ 1 }
      { ...rest }
    >
      { nativeValue }
      { usdValue }
    </chakra.span>
  );
};

export default React.memo(AssetValue);
