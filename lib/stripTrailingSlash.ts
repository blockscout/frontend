const stripTrailingSlash = (str: string) => str[str.length - 1] === '/' ? str.slice(0, -1) : str;

export default stripTrailingSlash;
