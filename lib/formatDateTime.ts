export default function formatDateTime(t: Date, options?: {
  showTime?: boolean;
  showDate?: boolean;
  timeWithoutSeconds?: boolean;
  dateWithoutYear?: boolean;
}) {
  const seconds = t.getSeconds().toString().padStart(2, '0');
  const minutes = t.getMinutes().toString().padStart(2, '0');
  const hours = t.getHours().toString().padStart(2, '0');

  const day = t.getDate().toString().padStart(2, '0');
  const month = (t.getMonth() + 1).toString().padStart(2, '0');
  const year = (t.getFullYear() % 100).toString().padStart(2, '0');

  const date = `${ day }/${ month }${ options?.dateWithoutYear ? '' : `/${ year }` }`;
  const time = `${ hours }:${ minutes }${ options?.timeWithoutSeconds ? '' : `:${ seconds }` }`;

  if (options?.showDate && options?.showTime) {
    return `${ date } ${ time }`;
  } else
  if (options?.showDate) {
    return date;
  } else
  if (options?.showTime) {
    return time;
  }

  return `${ date } ${ time }`;
}
