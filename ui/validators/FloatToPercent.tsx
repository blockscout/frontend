/* eslint-disable */

const FloatToPercent = (value: number | string) : string => {
    if (typeof value === 'number') {
        return `${(value * 100).toFixed(2)}%`;
    } else if (typeof value === 'string') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
        return `${(numValue * 100).toFixed(2)}%`;
        }
    }
    return '';
}

export default FloatToPercent;