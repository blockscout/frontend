const stripLeadingSlash = (str: string) => str[0] === '/' ? str.slice(1) : str;

export default stripLeadingSlash;
