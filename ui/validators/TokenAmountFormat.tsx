/* eslint-disable */

const MAX_DECIMALS = 8;

/** 根据数值大小计算需要保留的小数位，再限制到 ≤ 8 */
function getNonZeroDecimals(num: number): number {
  const s = num.toString();

  // 非科学计数法：数出真正的有效位，再 cap 到 8
  if (!s.includes('e')) {
    const match = s.match(/^-?\d*\.(\d*?)0*$/);
    return Math.min(match ? match[1].length : 0, MAX_DECIMALS);
  }

  // 科学计数法：10^(-exponent) - 1，就是应该保留的小数位
  const [, expStr] = num.toExponential().split('e');   // 如 "3.3e-4" → "-4"
  const exponent = parseInt(expStr, 10);               // -4
  const decimals = Math.max(0, -exponent + 1);         // 4 → 0.0003
  return Math.min(decimals, MAX_DECIMALS);
}

/** 统计小数位（去掉尾部 0） */
function countDecimalPlaces(str: string): number {
  const m = str.match(/^-?\d*\.(\d*?)0*$/);
  return m ? m[1].length : 0;
}

/** 主格式化函数 */
export const TokenAmountFormat = (value: string | number): string => {
  const _v = typeof value === 'number' ? value : Number(value);
  if (isNaN(_v) || _v === 0) return '0';

  /* ①  n ≥ 0.01 —— 保留 2 位小数 */
  if (_v >= 0.01) {
    const rounded = Math.round(_v * 100) / 100;        // 已四舍五入到 2 位
    return rounded.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,                        // 天然 ≤ 8
    });
  }

  /* ②  1e-8 ≤ n < 0.01 —— 保留 1 位有效数字，但小数位 ≤ 8 */
  if (_v >= 1e-8) {
    const oneSig = Number(_v.toExponential(1));        // 1 位有效数字
    const decimals = getNonZeroDecimals(oneSig);       // cap 到 8
    return oneSig
      .toFixed(decimals)                               // 非科学计数法
      .replace(/\.?0+$/, '');                          // 去掉多余 0 或 “.”
  }

  /* ③  n < 1e-8 —— 固定显示 0.00000001（8 位小数） */
  return '0.00000001';
};


export default TokenAmountFormat;