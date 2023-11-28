export default function shortDate(timestamp: number) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const date = new Date(timestamp);
  const year = date.getFullYear();

  const zp = (n: number) => n.toString().padStart(2, '0');

  const time = `${ zp(date.getHours()) }:${ zp(date.getMinutes()) }`;

  if (year === currentYear) {
    return `${ zp(date.getDate()) }/${ zp(date.getMonth() + 1) } ${ time }`;
  } else {
    return `${ zp(date.getDate()) }/${ zp(date.getMonth() + 1) }/${ zp(year % 100) } ${ time }`;
  }
}
