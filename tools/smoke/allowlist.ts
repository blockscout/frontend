interface AllowedPageError {
  readonly thirdParty: string;
  readonly stack: RegExp;
}

export const ALLOWED_PAGE_ERRORS: ReadonlyArray<AllowedPageError> = [
  {
    thirdParty: 'the adx.ws ad loader, rendering a winning bid into an ad slot that is no longer on the page',
    stack: /Cannot set properties of null \(setting 'innerHTML'\)\s+at renderPrebidWinningBid \(https:\/\/cdn\.adx\.ws\//,
  },
];

export const isAllowedPageError = (error: Error): boolean => {
  const stack = error.stack ?? error.message;
  return ALLOWED_PAGE_ERRORS.some((allowed) => allowed.stack.test(stack));
};
