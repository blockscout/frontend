const useFeatureValue = (name, fallback) => {
  try {
    const { value, type } = JSON.parse(localStorage.getItem(`pw_feature:${ name }`));

    const formattedValue = (() => {
      switch (type) {
        case 'boolean': {
          return value === 'true';
        }
        case 'number': {
          return Number(value);
        }
        default:
          return value;
      }
    })();

    return { isLoading: false, value: formattedValue };

  } catch (error) {
    return { isLoading: false, value: fallback };
  }
};

export default useFeatureValue;
