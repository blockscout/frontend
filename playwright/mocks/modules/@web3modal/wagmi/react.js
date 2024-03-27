function useWeb3Modal() {
  return {
    open: () => {},
  };
}

function useWeb3ModalState() {
  return {
    isOpen: false,
  };
}

function useWeb3ModalTheme() {
  return {
    setThemeMode: () => {},
  };
}

function createWeb3Modal() {}

export {
  createWeb3Modal,
  useWeb3Modal,
  useWeb3ModalState,
  useWeb3ModalTheme,
};
