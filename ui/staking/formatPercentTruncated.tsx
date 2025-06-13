/* eslint-disable */
import Decimal from 'decimal.js';

const formatPercentTruncated = (
  _num: number | string | null | undefined,
  decimalPlaces: number = 2
): string => {
  if (_num === null || _num === undefined || isNaN(Number(_num))) {
    return '-';
  }

  const num = new Decimal(Number(_num) ).mul(100).toNumber(); // 乘以100以便截断到小数点后两位
  
  if (num === 0) return '0%';
  if (num > 0 && num < 0.01) return '<0.01%';

  // 截断到小数点后两位
  const sum = new Decimal(num).mul(100).toNumber(); // 乘以10000以便截断到小数点后四位
  // 截断到小数点后四位
  const truncated = new Decimal( Math.trunc(sum) ).div(100).toNumber();
  
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