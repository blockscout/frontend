const useFeatureValue = (name, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(`pw_feature:${ name }`));
    return { isLoading: false, value };
  } catch (error) {
    return { isLoading: false, value: fallback };
  }
};

export default useFeatureValue;
