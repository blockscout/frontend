export default function formatDate(date: Date) {
  return date.toISOString().substring(0, 10);
}
