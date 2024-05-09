export const COLOR_HEX_REGEXP = /^[A-Fa-f\d]{3,6}$/;

export const validator = (value: string | undefined) => {
  if (!value || value.length === 0) {
    return true;
  }

  if (value.length !== 3 && value.length !== 6) {
    return 'Invalid length';
  }

  if (!COLOR_HEX_REGEXP.test(value)) {
    return 'Invalid hex code';
  }

  return true;
};
