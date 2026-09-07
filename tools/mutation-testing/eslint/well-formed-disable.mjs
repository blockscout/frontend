// The ESLint side of the mutation gate: suppressing a mutant has to stay a claim a reviewer can
// check, so this rule allows only the fully specified disable comment. Registered from the root
// eslint.config.mjs, which is where the repo's rule set lives.
//
// Stryker's directive grammar (@stryker-mutator/instrumenter, directive-bookkeeper.js) is
//   Stryker (disable|restore) [next-line] <MutatorName>[,<MutatorName>…][: <reason>]
// and everything after `disable` is optional to it. Without `next-line` a disable runs to the end of
// the file, and `all` covers every mutator — both mute code nobody chose to exempt.

const STRYKER_DISABLE = /^\s*Stryker\s+disable\b/;
const STRYKER_WILDCARD = 'all';
const STRYKER_MUTATOR_NAME = /^[a-z]+$/i;
const STRYKER_WELL_FORMED = '// Stryker disable next-line <MutatorName>: <reason>';

// The comma-separated mutator list Stryker parses, and whether the directive was scoped to one line.
function parseStrykerDisable(directive) {
  const words = directive.trim().split(/\s+/).slice(2);
  const scoped = words[0] === 'next-line';
  const listed = scoped ? words.slice(1) : words;

  return { scoped, mutators: listed.join(' ').split(',').map((mutator) => mutator.trim()).filter(Boolean) };
}

export function strykerDisableProblem(comment) {
  const [ directive, ...reason ] = comment.split(':');
  const { scoped, mutators } = parseStrykerDisable(directive);

  if (mutators.length === 0) return 'noMutator';
  if (!scoped) return 'fileScoped';
  if (mutators.includes(STRYKER_WILDCARD)) return 'wildcard';
  if (!mutators.every((mutator) => STRYKER_MUTATOR_NAME.test(mutator))) return 'noMutator';
  if (reason.join(':').trim() === '') return 'noReason';
  return undefined;
}

export const strykerDisableRule = {
  meta: {
    type: 'problem',
    messages: {
      noMutator: `A Stryker disable must name the mutators it silences, comma-separated: ${ STRYKER_WELL_FORMED }`,
      fileScoped: `A Stryker disable must be scoped to the line it exempts: ${ STRYKER_WELL_FORMED }`,
      wildcard: `"all" silences every mutator. Name the ones being silenced: ${ STRYKER_WELL_FORMED }`,
      noReason: `A Stryker disable must give its reason after a colon: ${ STRYKER_WELL_FORMED }`,
    },
    schema: [],
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (!STRYKER_DISABLE.test(comment.value)) continue;

          const messageId = strykerDisableProblem(comment.value);
          if (messageId) context.report({ loc: comment.loc, messageId });
        }
      },
    };
  },
};
