module.exports = {
  route: jest.fn((opts) => {
    if (opts?.pathname?.includes('[hash]')) {
      return `/address/${ opts.query?.hash || 'test-hash' }`;
    }
    if (opts?.pathname?.includes('[name]')) {
      return `/clusters/${ opts.query?.name || 'test-cluster' }`;
    }
    return opts?.pathname || '/';
  }),
};
