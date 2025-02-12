const useReCaptcha = () => {
  return {
    ref: { current: null },
    executeAsync: () => Promise.resolve('recaptcha_token'),
  };
};

export default useReCaptcha;
