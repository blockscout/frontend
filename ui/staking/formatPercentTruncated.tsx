/* eslint-disable */
const formatPercentTruncated = (
  num: number | string | null | undefined,
  decimalPlaces: number = 2
): string => {
  if (num === null || num === undefined || num === '') return '-';

  const _num = typeof num === 'number' ? num : Number(num);
  if (isNaN(_num)) return '-';

  if (_num === 0) return '0%';

  const percentValue = _num * 100;
  const factor = Math.pow(10, decimalPlaces);
  const truncated = Math.trunc(percentValue * factor) / factor;

  // 小于最小展示值（如 0.01%）
  if (truncated === 0 && percentValue > 0 && percentValue < 1 / factor) {
    return `<${(1 / factor).toFixed(decimalPlaces)}%`;
  }

  const [intPart, decPart = ''] = truncated.toString().split('.');

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const cleanedDec = decPart.slice(0, decimalPlaces).replace(/0+$/, '');

  return cleanedDec ? `${formattedInt}.${cleanedDec}%` : `${formattedInt}%`;
};

export default formatPercentTruncated;