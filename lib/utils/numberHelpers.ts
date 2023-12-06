import _ from 'lodash';

export function formatNumberString(number: string, decimalPlaces: number) {
  const [ whole, decimal ] = number.split('.');
  if (decimal) {
    return `${ whole }.${ decimal.slice(0, decimalPlaces) }`;
  }
  return whole;
}

export function formatNumberIsNeeded(number: string, decimalPlaces: number) {
  // eslint-disable-next-line
  const [whole, decimal] = number.split('.');
  if (decimal) {
    return decimal.length > decimalPlaces;
  }
  return false;
}

export function truncateMiddle(text: string, startLength: number, endLength: number): string {
  if (text.length <= startLength + endLength + 3) {
    return text;
  }
  return `${ text.substring(0, startLength) }...${ text.slice(-Math.abs(endLength)) }`;
}

export function roundNumberIfNeeded(number: string, decimalPlaces: number) {
  if (formatNumberIsNeeded(number, decimalPlaces)) {
    const rounded = _.round(parseFloat(number), decimalPlaces);

    if (rounded === 0) {
      const positiveNumbers = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

      const numberIndices = positiveNumbers.map((n => number.indexOf(n))).filter(n => n !== -1).sort((a, b) => a - b);

      const subStr = number.substring(0, numberIndices[0] + 1);

      return '~' + subStr;
    }

    return '~' + rounded.toString();
  }
  return number;
}
