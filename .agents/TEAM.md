# Team & Slack directory

The people, teams, and channels the team reaches on Slack, and the IDs needed to address them. This file is
the **single source of truth** for turning a name into a Slack ID: refer to people, teams, and channels **by
name** in specs, skills, and requests, and resolve the ID here whenever you actually need to send a message
or build a mention or link. It is a registry only — *who* gets asked *what* is routing policy that lives in
the skills that read it.

A **✓** in a team's *Default* column flags that team's fallback member — the one to contact when a request
doesn't name a specific person.

Slack IDs are stored so addressing is deterministic (no runtime name lookup). They are workspace-scoped
identifiers, **not credentials** — knowing one grants no access. To find your own member ID in Slack:
your profile → **⋯ More** → **Copy member ID**. Do not add emails to this file.

## How to address

- **Person** — the *Slack member ID* (`U…`) from the People table. Mention as `<@U…>`; to DM, pass the ID as
  the channel to the send tool.
- **Team / group** — the *Slack group ID* (`S…`) from the Groups table. Mention as `<!subteam^S…>`.
- **Channel** — the *Channel ID* (`C…`). Pass it as the channel target when sending; refer to it in prose by
  its `#name`.
- **Permalink** — `https://blockscout.slack.com/archives/<channel-id>/p<message-ts>` (the message timestamp
  with the dot removed).

## Product managers

Own: product intent, scope, priorities, user stories, acceptance.

### People

| Name | GitHub | Slack member ID | Default |
| --- | --- | --- | --- |
| Ulyana | @ulyanas | U024DUPJG3A | ✓ |
| Nikita S. | @NikitaSavik | U05BR9QEYKB | |

## Designers

Own: mockups, missing screens/states, visual decisions.

### People

| Name | GitHub | Slack member ID | Default |
| --- | --- | --- | --- |
| Tatyana | @tgladilina | U039P3QLP0A | ✓ |

## Core API

Own: core API endpoints and response models, field propagation across services, backend release schedule.

### People

| Name | GitHub | Slack member ID | Default |
| --- | --- | --- | --- |
| Victor | @vbaranov | U8L403FEG | ✓ |
| Nikita P. | @nikitosing | U0218K3MTC5 | |

### Groups

| Team | Slack group ID |
| --- | --- |
| Core API | S064H6TD6MA |

## Microservices API

Own: microservice API endpoints and their response models (metadata, stats, admin, interchain, etc.).

### People

| Name | GitHub | Slack member ID | Focus | Default |
| --- | --- | --- | --- | --- |
| Leonid | @lok52 | U01KDJWBCV7 | | ✓ |
| Evgenii | @EvgenKor | U026N2LB01E | Interchain Indexer, TAC | |

### Groups

| Team | Slack group ID |
| --- | --- |
| Microservices API | S064073HASK |

### Channels

| Purpose | Channel | Channel ID |
| --- | --- | --- |
| Default for microservices questions | blockscout-rs | C03G1QASRJ8 |
| Metadata microservice | blockscout-metadata-service | C067RACJ99B |
| Admin RS microservice | blockscout-admin | C04TC4W81QV |
| Stats microservice | blockscout-stats-rs | C089CJF6P0X |

## Frontend

Own: architecture, the delegation boundary.

### People

| Name | GitHub | Slack member ID | Default |
| --- | --- | --- | --- |
| tom | @tom2drum | U03MN1588AU | ✓ |
| Max | @maxaleks | UKP0RR9K9 | |

### Channels

| Purpose | Channel | Channel ID |
| --- | --- | --- |
| Default for frontend questions | blockscout-frontend | C03MMUTQDNU |
| Ask a frontend engineer to prepare an instance's config | front-config-requests | C08D60ZL1QB |

### Groups

| Team | Slack group ID |
| --- | --- |
| Frontend team | S0601760KT9 |

## QA

Own: test plans, acceptance-criteria verification, regression coverage, release sign-off.

### People

| Name | GitHub | Slack member ID | Default |
| --- | --- | --- | --- |
| Yan | @yvaskov | U05Q4R111PB | ✓ |
| Alyona | @alyonakostina | U08NCHV535X | |

### Channels

| Purpose | Channel | Channel ID |
| --- | --- | --- |
| General questions | blockscout-qa | C059WER5EB1 |

### Groups

| Team | Slack group ID |
| --- | --- |
| QA team | S06015J7WVD |

## DevOps

Own: deployment and running-instance changes (env vars, image versions, restarts), CI/CD, and infrastructure.

### People

| Name | GitHub | Slack member ID | Default |
| --- | --- | --- | --- |
| Nick | @nzenchik | U04RVGGEW4Q | ✓ |
| Alik | @alik-agaev | U06287SP35W | |

### Channels

| Purpose | Channel | Channel ID |
| --- | --- | --- |
| General questions | blockscout-devops | C03K1932X1N |
| Requests to change a running instance (env vars, image versions, restarts, etc.) | blockscout-devops-requests | C050U1F2E9M |

### Groups

| Team | Slack group ID |
| --- | --- |
| DevOps team | S061MTPLJHK |

## Product channels

Dedicated channels for specific large tasks — a single place to gather a feature's requirements and related
discussion.

| Purpose | Channel | Channel ID |
| --- | --- | --- |
| Multichain explorer | blockscout-multichain-explorer | C08R0UNBE3A |
| Cross-chain transactions | dev-interchain | C0A7SALNLPL |
