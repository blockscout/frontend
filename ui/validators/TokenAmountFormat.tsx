/* eslint-disable */

const TokenAmountFormat = (value: string | number) => {
    const _v = typeof value === 'number' ? value : Number(value);
    if (isNaN(_v)  || _v === 0) {
        return 0;
    }
    if (_v  >= 0.01) {
        // 保留两位小数，四舍五入，不补0
        const rounded = Math.round(_v * 100) / 100;
        return rounded.toString();
    } else if (_v >= 1e-8) {
        // 保留1位有效数字
        const digits = Number(_v.toExponential(1)); // 四舍五入保留1位有效数字
        return digits.toString();
    } else {
        // 小于1e-8
        return '0.00000001';
    }
}

export default TokenAmountFormat;