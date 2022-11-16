export function shortenNumberWithLetter(
  x: number,
  params?: {
    unitSeparator: string;
  },
  _options?: Intl.NumberFormatOptions,
) {
  const options = _options || { maximumFractionDigits: 2 };
  const unitSeparator = params?.unitSeparator || '';

  if (x > 1_000_000_000) {
    return (x / 1_000_000_000).toLocaleString('en', options) + unitSeparator + 'B';
  }

  if (x > 1_000_000) {
    return (x / 1_000_000).toLocaleString('en', options) + unitSeparator + 'M';
  }

  if (x > 1_000) {
    return (x / 1_000).toLocaleString('en', options) + unitSeparator + 'K';
  }

  return x.toLocaleString('en', options);
}
