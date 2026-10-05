<!--
Template of `pnpm release notes`. A `## ` heading or a `---` line starts a block, and a block is left out of
the notes when any of its placeholders comes out empty. Placeholders: {{tag}}, {{previous_tag}},
{{prs:<section>}} for each section of tools/release/categories.ts, in its order, {{env_changes}},
{{compatibility}} and {{new_contributors}}.
-->
## 🚀 New Features
{{prs:New Features}}

## 🐛 Bug Fixes
{{prs:Bug Fixes}}

## ⚡ Performance Improvements
{{prs:Performance Improvements}}

## 📦 Dependencies Updates
{{prs:Dependencies Updates}}

## 🎨 Design Updates
{{prs:Design Updates}}

## 🛠️ DX & Tooling
{{prs:DX & Tooling}}

## ✨ Other Changes
{{prs:Other Changes}}

## 🚨 Changes in ENV variables
{{env_changes}}

**Full list of the ENV variables**: [{{tag}}](https://github.com/blockscout/frontend/blob/{{tag}}/docs/ENVS.md)

## 💑 Compatibility
This release raises the minimum required version of the following API services:

| Service | Version |
| --- | --- |
{{compatibility}}

## 🦄 New Contributors
{{new_contributors}}

---

**Full Changelog**: https://github.com/blockscout/frontend/compare/{{previous_tag}}...{{tag}}
