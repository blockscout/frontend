export const validator = (value: string | undefined) => {
  if (!value) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch (error) {
    return 'Incorrect URL';
  }
};
