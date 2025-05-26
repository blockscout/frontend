/* eslint-disable */
const percentageFormat = (num: number | string) => {
    const _n = Number(num);
    if (num === 0) {
        return '0';
    }

    const percent = _n * 100;

    if (percent < 0.01 && percent > 0) {
        return '0.01%';
    }

    // 四舍五入保留两位小数
    const rounded = Math.round(percent * 100) / 100;

    // 保证有两位小数（不足补0）
    return rounded.toFixed(2) + '%';
}


export default  percentageFormat ;