// SPDX-License-Identifier: LicenseRef-Blockscout

// Monaco renders one import path as several sibling tokens: a single-quoted Solidity string is split at every `/` and `.`.
export function getImportLinkPath(clickedToken: Element): string {
  const tokens: Array<Element> = [ clickedToken ];

  for (let token = clickedToken.previousElementSibling; isImportLinkToken(token); token = token.previousElementSibling) {
    tokens.unshift(token);
  }

  for (let token = clickedToken.nextElementSibling; isImportLinkToken(token); token = token.nextElementSibling) {
    tokens.push(token);
  }

  return tokens.map((token) => token.textContent).join('');
}

function isImportLinkToken(element: Element | null): element is Element {
  return Boolean(element?.classList.contains('import-link'));
}
