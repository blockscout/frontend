/* eslint-disable */
import Decimal from 'decimal.js';

const truncateTokenAmountWithComma = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '-';
  }

  const num = Number(value);
  
  if (num === 0) return '0';
  if (num > 0 && num < 0.01) return '<0.01';

  const sum = new Decimal(num).mul(100).toNumber(); 
  // 截断到小数点后四位
  const truncated = new Decimal( Math.trunc(sum) ).div(100).toNumber();

  const [intPartStr, decPart = ''] = truncated.toString().split('.');

  // 整数部分加千分位逗号
  const intWithComma = intPartStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 拼接小数部分
  if (decPart === '') {
    return intWithComma;
  } else if (decPart.length === 1) {
    return `${intWithComma}.${decPart}`;
  } else {
    return `${intWithComma}.${decPart.slice(0, 2)}`;
  }
};

export default truncateTokenAmountWithComma;