/* eslint-disable */

const truncateTokenAmountWithComma = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '-';
  }

  const num = Number(value);
  
  if (num === 0) return '0';
  if (num > 0 && num < 0.01) return '<0.01';

  // 截断到小数点后两位
  const truncated = Math.trunc(num * 100) / 100;
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