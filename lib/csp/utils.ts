import type CspDev from 'csp-dev';

export const KEY_WORDS = {
  BLOB: 'blob:',
  DATA: 'data:',
  NONE: '\'none\'',
  REPORT_SAMPLE: `'report-sample'`,
  SELF: '\'self\'',
  STRICT_DYNAMIC: `'strict-dynamic'`,
  UNSAFE_INLINE: '\'unsafe-inline\'',
  UNSAFE_EVAL: '\'unsafe-eval\'',
};

// we cannot use lodash/uniq in middleware code since it calls new Set() and it'is causing an error in Nextjs
// "Dynamic Code Evaluation (e. g. 'eval', 'new Function', 'WebAssembly.compile') not allowed in Edge Runtime"
export function unique(array: Array<string | undefined>) {
  const set: Record<string, boolean> = {};
  for (const item of array) {
    item && (set[item] = true);
  }

  return Object.keys(set);
}

export function makePolicyString(policyDescriptor: CspDev.DirectiveDescriptor) {
  return Object.entries(policyDescriptor)
    .map(([ key, value ]) => {
      if (!value || value.length === 0) {
        return;
      }

      const uniqueValues = unique(value);
      return [ key, uniqueValues.join(' ') ].join(' ');
    })
    .filter(Boolean)
    .join(';');
}
