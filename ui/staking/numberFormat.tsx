/* eslint-disable */

const formatNumberWithCommas = (num: number | string) => {
  const parsed = typeof num === "number" ? num : parseFloat(num);
  if (isNaN(parsed)) return "";
  return parsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getFormatterFloat = (value: number | string, decimals: number = 2) => {
    const _v = Number(value);
    if (!Number.isInteger(_v)) {
        return formatNumberWithCommas(_v.toFixed(decimals));
    } else {
        return formatNumberWithCommas(value);
    }
};
