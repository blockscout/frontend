// One flag's behaviour, discriminated by how it takes its value:
//   'switch'   — no value at all (--verbose)
//   'value'    — required, from `--flag=value` or the following token (--base)
//   'optional' — inline-only and optional (--changed[=<ref>]); a bare --changed keeps the default
//                ref, and the flag must never swallow the following token, which in CI is another flag
export type FlagSpec<Options> =
  { readonly kind: 'switch'; readonly apply: (options: Options) => void } |
  { readonly kind: 'value'; readonly apply: (options: Options, value: string) => void } |
  { readonly kind: 'optional'; readonly apply: (options: Options, value: string | undefined) => void };

// What happens to a flag the table does not know. A tool that owns its whole surface rejects it, with
// its usage text attached; a tool that wraps another CLI passes it through for that CLI to judge.
export type UnknownTokenPolicy =
  { readonly kind: 'reject'; readonly usage: string } |
  { readonly kind: 'passthrough' };

export interface ParsedArgs<Options> {
  readonly options: Options;
  // Positionals under either policy, plus unknown flags under 'passthrough', in argv order. An unknown
  // flag's value is a separate token the parser cannot tell apart from a positional, so keeping the
  // order is what hands `--project default` to the wrapped CLI intact.
  readonly rest: Array<string>;
}

// Split a token into its flag name and inline value: `--flag=value` splits at the first `=`, a bare
// `--flag` has no inline value.
function splitFlag(arg: string): { readonly name: string; readonly inline: string | undefined } {
  const equals = arg.indexOf('=');
  if (equals === -1) return { name: arg, inline: undefined };
  return { name: arg.slice(0, equals), inline: arg.slice(equals + 1) };
}

// Apply one argv token, returning how many tokens it consumed — 2 when a value flag took the following
// token, 1 otherwise. This is the validation half: it resolves the value form, applies the unknown-token
// policy, and rejects a missing or unwanted value. `parseArgs` below is the reading half and does
// nothing but walk the cursor.
function applyArg<Options>(
  arg: string,
  next: string | undefined,
  flags: ReadonlyMap<string, FlagSpec<Options>>,
  parsed: ParsedArgs<Options>,
  policy: UnknownTokenPolicy,
): number {
  if (!arg.startsWith('-')) {
    parsed.rest.push(arg);
    return 1;
  }

  const { name, inline } = splitFlag(arg);
  const spec = flags.get(name);
  if (spec === undefined) {
    if (policy.kind === 'reject') throw new Error(`Unknown flag: ${ name }\n${ policy.usage }`);
    parsed.rest.push(arg);
    return 1;
  }

  if (spec.kind === 'optional') {
    spec.apply(parsed.options, inline);
    return 1;
  }
  if (spec.kind === 'switch') {
    if (inline !== undefined) throw new Error(`${ name } takes no value`);
    spec.apply(parsed.options);
    return 1;
  }

  const value = inline ?? next;
  if (value === undefined) throw new Error(`Missing value for ${ name }`);
  spec.apply(parsed.options, value);
  return inline === undefined ? 2 : 1;
}

// The flag surface is a lookup table rather than an if/else chain, which removes the prefix-shadowing
// hazard a `startsWith` chain has (`--max-cognitive` matching `--max-cognitive-jsx` unless the arms are
// ordered just so). `options` is mutated in place.
export function parseArgs<Options>(
  argv: ReadonlyArray<string>,
  flags: ReadonlyMap<string, FlagSpec<Options>>,
  options: Options,
  policy: UnknownTokenPolicy,
): ParsedArgs<Options> {
  const parsed: ParsedArgs<Options> = { options, rest: [] };

  let index = 0;
  while (index < argv.length) {
    index += applyArg(argv[index], argv[index + 1], flags, parsed, policy);
  }

  return parsed;
}
