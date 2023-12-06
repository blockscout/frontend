export function camelCaseToSentence(camelCaseString: string | undefined) {
  if (!camelCaseString) {
    return '';
  }

  let sentence = camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2');
  sentence = sentence.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  sentence = capitalizeAcronyms(sentence);
  return sentence;
}

function capitalizeAcronyms(sentence: string) {
  const acronymList = [ 'NFT' ]; // add more acronyms here if needed

  const words = sentence.split(' ');

  const capitalizedWords = words.map((word) => {
    const acronym = word.toUpperCase();
    if (acronymList.includes(acronym)) {
      return acronym.toUpperCase();
    }
    return word;
  });

  return capitalizedWords.join(' ');
}

export function truncateMiddle(string: string, startLength: number, endLength: number): string {
  const text = string || '';

  if (!text) {
    return '';
  }

  if (text.length <= startLength + endLength + 3) {
    return text;
  }

  return `${ text.substring(0, startLength) }...${ text.slice(-Math.abs(endLength)) }`;
}
