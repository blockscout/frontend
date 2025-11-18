module.exports = {
  route: jest.fn((opts) => {
    const pathname = opts?.pathname;
    const query = opts?.query || {};

    if (pathname === '/address/[hash]') {
      return `/address/${ query.hash || 'test-hash' }`;
    }
    if (pathname === '/tx/[hash]') {
      return `/tx/${ query.hash || 'test-hash' }`;
    }
    if (pathname === '/name-services/clusters/[name]') {
      return `/name-services/clusters/${ query.name || 'test-cluster' }`;
    }

    return pathname || '/';
  }),
};
