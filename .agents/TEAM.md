# Team roster for product tasks

The teams involved in product tasks, the members an agent may need to reach, and their addresses in Slack.
A registry only — who gets asked what, and where, belongs to the skills that read it (`grill-the-task`,
`to-spec`). The `default` marker in a team's table flags that team's fallback member.

Slack **member IDs** are stored deliberately so routing is deterministic (no runtime name lookup). They are
workspace-scoped identifiers, not credentials — knowing one grants no access. To find yours in Slack:
your profile → **⋯ More** → **Copy member ID**. Do not add emails to this file.

## Product managers

Own: product intent, scope, priorities, user stories, acceptance.

| Name | GitHub | Slack member ID | Focus | |
| --- | --- | --- | --- | --- |
| Ulyana | @ulyanas | U024DUPJG3A | | default |
| Nikita S. | @NikitaSavik | U05BR9QEYKB | |  |

## Designers

Own: mockups, missing screens/states, visual decisions.

| Name | GitHub | Slack member ID | Focus | |
| --- | --- | --- | --- | --- |
| Tatyana | @tgladilina | U039P3QLP0A | | default |

## Backend engineers

Own: API endpoints, response models, field propagation across services, backend release schedule.

### People

| Name | GitHub | Slack member ID | Focus | |
| --- | --- | --- | --- | --- |
| Victor | @vbaranov | U8L403FEG | Core API | default |
| Nikita P. | @nikitosing | U0218K3MTC5 | Core API |  |
| Leonid | @lok52 | U01KDJWBCV7 | Microservices API | default |
| Evgenii | @EvgenKor | U026N2LB01E | Microservices API: Interchain Indexer, TAC | |

### Groups

Slack **group IDs** start with `S`, and a group is addressed by ID rather than by handle:
`<!subteam^SXXXXXXXX>`. To find one: the group's page in the workspace's user-group settings — its URL ends
with the ID.

| Team | Slack group ID |
| --- | --- |
| Core API | S064H6TD6MA |
| Microservices API | S064073HASK |

## Frontend

Own: architecture, the delegation boundary.

| Name | GitHub | Slack member ID | Focus | |
| --- | --- | --- | --- | --- |
| tom | @tom2drum | U03MN1588AU | | default |
| Max | @maxaleks | UKP0RR9K9 | | default |

## Slack channels

| Purpose | Channel | Channel ID |
| --- | --- | --- |
| Default for product questions | blockscout-frontend | C03MMUTQDNU |
| Multichain explorer | blockscout-multichain-explorer | C08R0UNBE3A |
| Cross-chain transactions | dev-interchain | C0A7SALNLPL |
