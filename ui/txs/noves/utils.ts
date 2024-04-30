export function camelCaseToSentence(camelCaseString: string | undefined) {
  if (!camelCaseString) {
    return '';
  }

  let sentence = camelCaseString.replace(/([a-z])([A-Z])/g, '$1 $2');
  sentence = sentence.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

  return sentence;
}
