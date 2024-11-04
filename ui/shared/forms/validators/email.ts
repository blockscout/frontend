export const EMAIL_REGEXP = /^[\w.%+-]+@[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)+$/;

export const validator = (value: string) => EMAIL_REGEXP.test(value) ? true : 'Invalid email';
