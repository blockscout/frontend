export default function getConfirmationString(durations: Array<number>) {
  if (durations.length === 0) {
    return '';
  }

  const [ lower, upper ] = durations.map((time) => time / 1_000);

  if (!upper) {
    return `Confirmed within ${ lower } secs`;
  }

  if (lower === 0) {
    return `Confirmed within <= ${ upper } secs`;
  }

  return `Confirmed within ${ lower } - ${ upper } secs`;
}
