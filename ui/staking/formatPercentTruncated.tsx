/* eslint-disable */
const formatPercentTruncated = (
  _num: number | string | null | undefined,
  decimalPlaces: number = 2
): string => {
  if (_num === null || _num === undefined || isNaN(Number(_num))) {
    return '-';
  }

  const num = Number(_num) * 100; // 转换为百分比
  
  if (num === 0) return '0%';
  if (num > 0 && num < 0.01) return '<0.01%';

  // 截断到小数点后两位
  const truncated = Math.trunc(num * 100) / 100;
  const [intPartStr, decPart = ''] = truncated.toString().split('.');
  const intWithComma = intPartStr;

  // 拼接小数部分
  if (decPart === '') {
    return intWithComma + '%';
  } else if (decPart.length === 1) {
    return `${intWithComma}.${decPart}%`;
  } else {
    return `${intWithComma}.${decPart.slice(0, 2)}%`;
  }
};
export default formatPercentTruncated;