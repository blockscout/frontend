/* eslint-disable */

const FloatToPercent = (value: number | string): string => {
    const numValue = typeof value === 'number' ? value : Number(value);
    if (isNaN(numValue)) return '';

    return `${(numValue * 100).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}%`;
};

export default FloatToPercent;