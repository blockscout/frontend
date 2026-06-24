# Slack message template — staging roll-up request

Used in the final step of the `prepare-release` skill to ask the DevOps team to roll up
a freshly published **frontend** pre-release on the staging instances.

- **Channel:** `#blockscout-devops-requests` (ID `C050U1F2E9M`)
- **QA cc:** the QA team user group, mention token `<!subteam^S06015J7WVD>`
- **Always draft first** and get the user's approval before sending.

## Placeholders

| Placeholder              | Meaning                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `<alpha-tag>`            | The pre-release tag, e.g. `v1.3.0-alpha`.                               |
| `<breaking-env-changes>` | Bulleted list of breaking ENV changes, or the single line `None.`       |
| `<release-url>`          | Link to the published GitHub pre-release.                              |

A change is **breaking** if a deployment must change its config to keep working: a
**removed** variable, a **renamed** variable, or a change to a **required**/default value
or **allowed value set**. New optional variables are *not* breaking. When in doubt, list it
and mark it `(potentially breaking)` — better to over-report than to miss one.

## Template

```
📦 Frontend pre-release *`<alpha-tag>`* is ready for staging.

Could you please roll up this pre-release tag on the staging instances?

*Breaking ENV changes:*
<breaking-env-changes>

Release notes: <release-url>

cc <!subteam^S06015J7WVD>
```

### Example — with breaking changes

```
📦 Frontend pre-release *`v1.3.0-alpha`* is ready for staging.

Could you please roll up this pre-release tag on the staging instances?

*Breaking ENV changes:*
• Removed `NEXT_PUBLIC_FOO` — the X feature now reads from `NEXT_PUBLIC_BAR` instead.
• Renamed `NEXT_PUBLIC_OLD` → `NEXT_PUBLIC_NEW`.
• `NEXT_PUBLIC_AD_BANNER_PROVIDER`: removed the `hype` option (potentially breaking).

Release notes: https://github.com/blockscout/frontend/releases/tag/v1.3.0-alpha

cc <!subteam^S06015J7WVD>
```

### Example — no breaking changes

```
📦 Frontend pre-release *`v1.3.0-alpha`* is ready for staging.

Could you please roll up this pre-release tag on the staging instances?

*Breaking ENV changes:* None.

Release notes: https://github.com/blockscout/frontend/releases/tag/v1.3.0-alpha

cc <!subteam^S06015J7WVD>
```
