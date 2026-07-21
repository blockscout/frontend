# Team roster for product tasks

The teams involved in product tasks, with the members an agent may need to reach. Teams have several
people — during a grilling session (`grill-the-task`) the developer picks **one contact per relevant team
for the task**; the picks are recorded in the spec header and open questions are routed to those contacts.
The member marked **default** is the fallback when the developer has no task-specific pick.

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

| Name | GitHub | Slack member ID | Focus | |
| --- | --- | --- | --- | --- |
| Victor | @vbaranov | U8L403FEG | Core API | default |
| Nikita P. | @nikitosing | U0218K3MTC5 | Core API |  |
| Leonid | @lok52 | U01KDJWBCV7 | Microservices API | default |
| Evgenii | @EvgenKor | U026N2LB01E | Microservices API: Intercahin Indexer, TAC | |

## Frontend

Own: architecture, the delegation boundary.

| Name | GitHub | Slack member ID | Focus | |
| --- | --- | --- | --- | --- |
| tom | @tom2drum | U03MN1588AU | | default |
| Max | @maxaleks | UKP0RR9K9 | | default |

## Slack channels

Product questions are asked **in a channel, not a DM**, so other teams (QA in particular) see the answers.
The default is the frontend channel below; a large feature may have its own dedicated channel — recorded in
the task's spec header — and then **all** of that task's questions go there. Channel posts always mention
the addressee by member ID.

| Purpose | Channel | Channel ID |
| --- | --- | --- |
| Default for product questions | blockscout-frontend | C03MMUTQDNU |
| Multichain explorer | blockscout-multichain-explorer | C08R0UNBE3A |
| Cross-chain transactions | dev-interchain | C0A7SALNLPL |
