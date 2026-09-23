# Slack message template — staging roll-up request

Used in the final step of the `prepare-release` skill to ask the DevOps team to roll up
a freshly published **frontend** pre-release on the staging instances.

- **Channel:** the DevOps *requests* channel — resolve its ID from `.agents/TEAM.md` (DevOps → Channels,
  `blockscout-devops-requests`).
- **QA cc:** the QA team user group — resolve its group ID from `.agents/TEAM.md` (QA → Groups) and build the
  mention token `<!subteam^<group-id>>`.
- **Always draft first** and get the user's approval before sending.

Slack IDs are **not** duplicated here on purpose — `.agents/TEAM.md` is the single source of truth for every
channel and group ID, so a moved channel or renamed group is fixed in one place.

## Placeholders

| Placeholder              | Meaning                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `<alpha-tag>`            | The pre-release tag, e.g. `v1.3.0-alpha`.                               |
| `<breaking-env-changes>` | Bulleted list of breaking ENV changes, or the single line `Отсутствуют.`        |
| `<release-url>`          | Link to the published GitHub pre-release.                              |
| `<qa-group-mention>`     | QA team group mention token `<!subteam^<group-id>>`, built from `.agents/TEAM.md`. |

A change is **breaking** if a deployment must change its config to keep working: a
**removed** variable, a **renamed** variable, or a change to a **required**/default value
or **allowed value set**. New optional variables are *not* breaking. When in doubt, list it
and mark it `(возможно, ломающее)` — better to over-report than to miss one.

## Template

```
📦 Пре-релиз фронтенда *`<alpha-tag>`* готов для стейджинга.

Раскатите, пожалуйста, этот тег на стейджинг-инстансы.

*Ломающие изменения ENV:*
<breaking-env-changes>

Содержание релиза: <release-url>

cc <qa-group-mention>
```

### Example — with breaking changes

```
📦 Пре-релиз фронтенда *`v1.3.0-alpha`* готов для стейджинга.

Раскатите, пожалуйста, этот тег на стейджинг-инстансы.

*Ломающие изменения ENV:*
• Удалена `NEXT_PUBLIC_FOO` — фича X теперь читает `NEXT_PUBLIC_BAR`.
• Переименована `NEXT_PUBLIC_OLD` → `NEXT_PUBLIC_NEW`.
• `NEXT_PUBLIC_AD_BANNER_PROVIDER`: удалено значение `hype` (возможно, ломающее).

Содержание релиза: https://github.com/blockscout/frontend/releases/tag/v1.3.0-alpha

cc <qa-group-mention>
```

### Example — no breaking changes

```
📦 Пре-релиз фронтенда *`v1.3.0-alpha`* готов для стейджинга.

Раскатите, пожалуйста, этот тег на стейджинг-инстансы.

*Ломающие изменения ENV:* Отсутствуют.

Содержание релиза: https://github.com/blockscout/frontend/releases/tag/v1.3.0-alpha

cc <qa-group-mention>
```
