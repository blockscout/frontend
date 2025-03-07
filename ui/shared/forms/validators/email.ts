export const EMAIL_REGEXP = /^[\w.%+-]+@[a-z\d-]+(?:\.[a-z\d-]+)+$/i;

export const validator = (value: string) => EMAIL_REGEXP.test(value) ? true : 'Invalid email';
