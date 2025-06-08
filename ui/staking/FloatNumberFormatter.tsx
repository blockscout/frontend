/* eslint-disable */

const floatNumberFormatter = (_num: number | string, decimalPlaces: number = 2): string => {
    let num = _num ; 
    if (typeof num === 'number') {
        num = String(num).replace(/,/g, ''); // 移除字符串中的逗号
    }

  // 拆分整数部分和小数部分
  const [integerPart, decimalPart = ''] = num.toString().split('.');

  // 整数部分加逗号
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 截断小数部分，不进行四舍五入
  const truncatedDecimal = decimalPart.slice(0, decimalPlaces);

  // 组合结果
  return truncatedDecimal
    ? `${formattedInteger}.${truncatedDecimal}`
    : formattedInteger;
}

export default floatNumberFormatter;