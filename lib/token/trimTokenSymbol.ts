// some tokens could have symbols like "ipfs://QmUpFUfVKDCWeZQk5pvDFUxnpQP9N6eLSHhNUy49T1JVtY"
// so in some cases we trim it to max 10 symbols
export default function trimTokenSymbol(symbol: string | null) {
  if (!symbol) {
    return '';
  }

  if (symbol.length <= 7) {
    return symbol;
  }

  return symbol.slice(0, 7) + '...';
}
