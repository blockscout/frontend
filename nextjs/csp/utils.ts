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

// we cannot use lodash/uniq and lodash/mergeWith in middleware code since it calls new Set() and it'is causing an error in Next.js
// "Dynamic Code Evaluation (e. g. 'eval', 'new Function', 'WebAssembly.compile') not allowed in Edge Runtime"
export function unique(array: Array<string | undefined>) {
  const set: Record<string, boolean> = {};
  for (const item of array) {
    item && (set[item] = true);
  }

  return Object.keys(set);
}

export function mergeDescriptors(...descriptors: Array<CspDev.DirectiveDescriptor>) {
  return descriptors.reduce((result, item) => {
    for (const _key in item) {
      const key = _key as CspDev.Directive;
      const value = item[key];

      if (!value) {
        continue;
      }

      if (result[key]) {
        result[key]?.push(...value);
      } else {
        result[key] = [ ...value ];
      }
    }

    return result;
  }, {} as CspDev.DirectiveDescriptor);
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
