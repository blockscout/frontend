// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { replaceQuotes } from 'src/config/utils/envs';

export const protocols = [ 'http', 'https' ] as const;

// The app reads flags with `=== 'true'`, so `1` / `TRUE` must fail here rather than silently mean false.
export const envBoolean = () => v.pipe(
  v.string(),
  v.picklist([ 'true', 'false' ], (issue) => `Expected "true" or "false" but received ${ JSON.stringify(issue.input) }`),
  v.transform((value) => value === 'true'),
);

const DECIMAL_NUMBER_REGEXP = /^-?\d+(\.\d+)?$/;

export const envNumber = () => v.pipe(
  v.string(),
  v.regex(DECIMAL_NUMBER_REGEXP, (issue) => `Expected a decimal number but received ${ JSON.stringify(issue.input) }`),
  v.transform(Number),
  v.number(),
);

export const envPositiveInteger = () => v.pipe(envNumber(), v.integer(), v.minValue(1));

const isUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Operators unset a variable with `FOO=`, which the container delivers as '', so '' is not a URL error.
export const envUrl = () => v.pipe(
  v.string(),
  v.check((value) => value === '' || isUrl(value), (issue) => `Invalid URL: Received ${ JSON.stringify(issue.input) }`),
);

export const envRequiredString = () => v.pipe(v.string(), v.nonEmpty());

export const envJson = <TSchema extends v.GenericSchema>(schema: TSchema) => v.pipe(
  v.string(),
  v.rawTransform(({ dataset, addIssue, NEVER }): unknown => {
    try {
      return JSON.parse(replaceQuotes(dataset.value) as string);
    } catch {
      addIssue({ message: `Invalid JSON: Received ${ JSON.stringify(dataset.value) }` });
      return NEVER;
    }
  }),
  schema,
);

type EnvRecord = Record<string, unknown>;

type DependencyPredicate = (dependencyValue: unknown) => boolean;

const isSet: DependencyPredicate = (value) => Boolean(value);

interface CompanionRuleOptions {
  when?: DependencyPredicate;
  message?: string;
}

// Typed for the whole env map rather than one object shape, so a rule may name a variable that another
// sub-schema declares (the sub-schema must be a `looseObject` for that key to reach the rule, unparsed);
// `partialCheck` skips the rule while either variable is itself invalid. The cast re-attaches the pipe's
// own object type, which `partialCheck`'s generics cannot express for a string-keyed selection.
export function companionRule<TInput extends EnvRecord = EnvRecord>(
  names: ReadonlyArray<string>,
  requirement: (input: TInput) => boolean,
  message: string,
): v.GenericValidation<TInput, TInput> {
  const paths = names.map((name): [ string ] => [ name ]) as [ [ string ], ...Array<[ string ]> ];
  const rule = v.partialCheck<EnvRecord, typeof paths, EnvRecord, string>(paths, requirement as (input: EnvRecord) => boolean, message);
  return rule as unknown as v.GenericValidation<TInput, TInput>;
}

export function requires<TInput extends EnvRecord = EnvRecord>(
  dependent: string,
  dependency: string,
  { when = isSet, message }: CompanionRuleOptions = {},
): v.GenericValidation<TInput, TInput> {
  return companionRule<TInput>(
    [ dependent, dependency ],
    (input) => input[dependent] === undefined || when(input[dependency]),
    message ?? `${ dependent } can only be used with ${ dependency }`,
  );
}

export function requiredIf<TInput extends EnvRecord = EnvRecord>(
  dependent: string,
  dependency: string,
  { when = isSet, message }: CompanionRuleOptions = {},
): v.GenericValidation<TInput, TInput> {
  return companionRule<TInput>(
    [ dependent, dependency ],
    (input) => !when(input[dependency]) || input[dependent] !== undefined,
    message ?? `${ dependent } is required when ${ dependency } is set`,
  );
}

export type EnvSchema = v.GenericSchema<EnvRecord, EnvRecord> & { readonly entries: Record<string, v.GenericSchema> };

// Each sub-schema validates the whole env map on its own (that is what lets a companion rule name a
// variable another file declares). `v.intersect` would do the same but then merges the members' outputs,
// and a `looseObject` member hands the raw string through while the owning member hands the parsed
// value, which the merge reports as a type clash.
export function composeSchemas(schemas: ReadonlyArray<EnvSchema>) {
  const envNames = schemas.flatMap((schema) => Object.keys(schema.entries));
  const knownNames = new Set(envNames);

  const schema = v.pipe(
    v.looseObject({}),
    v.rawCheck(({ dataset, addIssue }) => {
      if (!dataset.typed) {
        return;
      }
      const unknown = Object.keys(dataset.value).filter((name) => !knownNames.has(name));
      if (unknown.length > 0) {
        addIssue({ message: `Unknown ENV variables were provided: ${ unknown.join(', ') }` });
      }
      for (const subSchema of schemas) {
        const result = v.safeParse(subSchema, dataset.value);
        result.issues?.forEach((issue) => addIssue({ message: issue.message, path: issue.path, input: issue.input }));
      }
    }),
  );

  return { ...schema, envNames };
}

export function getValidationErrors(schema: v.GenericSchema, value: unknown): Array<string> {
  const result = v.safeParse(schema, value);
  if (result.success) {
    return [];
  }
  return result.issues.map((issue) => {
    const path = v.getDotPath(issue);
    return path ? `${ path }: ${ issue.message }` : issue.message;
  });
}
