export default function formatNumberToMetricPrefix(number: number) {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 3,
  }).format(number);
}
