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
    const rounded = Math.round(percent * 100) / 100;
    return rounded.toFixed(2) + '%';
}


export default  percentageFormat ;