# Compose a Slack message

How to write a message the Slack connector (`slack_send_message`) posts. Who to send it to is up to the skill that sends it. Slack IDs come from `./TEAM.md`.

## Language

Russian — the team's internal language. A reply in an existing thread matches the thread's language.

## Addressing

- **Person** — the *Slack member ID* (`U…`). Mention as `<@U…>`; to DM, pass the ID as the channel to the send tool.
- **Team / group** — the *Slack group ID* (`S…`). Mention as `<!subteam^S…>`.
- **Channel** — the *Channel ID* (`C…`). Pass it as the channel target when sending; refer to it in prose by its `#name`.
- **Permalink** — `https://blockscout.slack.com/archives/<channel-id>/p<message-ts>` (the message timestamp with the dot removed).

## Links

End a bare URL with a space, an empty line, or the end of the message. Slack's link parser runs through a single line break: with `https://example.com` followed by a newline and `Next line`, the next line's first word becomes part of the link, and Cyrillic gets punycoded into the hostname (`…xn--com-…`).

```
Демо:
https://review-foo.k8s-dev.blockscout.com

Посмотри, пожалуйста.
```

Slack also links a dotted word that ends in a TLD: `selected.control.bg` posts as a link. Rephrase the word, or keep it in backticks, which Slack leaves as text.

## Content

The rules for a message no skill templates. A skill's own template wins over them.

Write for a reader who has never opened the repo: a designer, a PM, a backend engineer. A colleague who wants the code asks for it.

- **The first sentence answers the question.** Address whoever asked. Mention someone else only when they must act.
- **The reader's vocabulary.** A word stays when the reader sees, types or clicks it: a status the admin panel shows, a contrast ratio, an env name the reader configures, an element on the page. A word that describes how the code works goes: a token, a CSS property, a file path, a line number, a function, a request method, a service name. Say what it does on screen instead.
- **Four sentences, prose.** The answer, the cause, what happens next, one line of evidence. The ask, when the reader has to choose, is a further sentence. No section labels. A reply that needs more carries the rest in an artifact and links it.
- **Evidence the reader can check.** "Открыл Plume в теме dim и замерил ссылку: 2.87:1", not pixel values or a test file name.
- **Detail lives in the artifact.** A PR, an issue or a comment carries the tokens, paths and the hypotheses ruled out; the message links it. Without an artifact the detail stays in the chat or the Honk terminal summary. File an issue only when a person asks for one.
- **Links, never bare numbers.** A PR or issue the reader will open is a link: `<https://github.com/blockscout/frontend/pull/3644|#3644>`. History is prose with no number: "после недавней смены цвета заливки".
- **End with the ask.** When the reply needs something from the reader, close with one explicit question and the options named. Mention the decider with `<@U…>`, except in a DM or when the reply answers the thread's starter and nobody else has replied. The role that decides is the "Own:" line of their team in `./TEAM.md`.
- **The run's history stays in the chat.** A permission granted mid-run, an attachment that would not open, an endpoint that answered 500 while reproducing: none of it is in the message. A missing input is a plain request for it.

```
BAD — the developer's report pasted into Slack
*Почему:* и заливка, и рамка выбранного элемента — один и тот же полупрозрачный токен
`selected.control.bg` (`blackAlpha.100` в светлой теме). Фон рисуется и под рамкой
(`background-clip: border-box`). Стало видно после #3736. Файлы:
`src/toolkit/theme/recipes/button.recipe.ts`, `tabs.recipe.ts`.
*Как проверил:* в Playwright-тесте снял пиксели выбранной кнопки. Рамка 227, заливка 241.

GOOD — the same finding for the designer who reported it: four sentences, then the ask
Ты права, дело в прозрачности: рамка и заливка выбранного таба одного полупрозрачного
цвета, а заливка рисуется и под рамкой, поэтому там цвет ложится дважды и рамка выходит
темнее. Стало заметно после недавней смены цвета заливки на полупрозрачный. Проверил на
живой странице: рамка на один тон темнее заливки. Два варианта: не рисовать заливку под
рамкой (рамка исчезнет) или дать рамке непрозрачный цвет. Какой выбираем?
```

## Attribution

The connector appends a *Sent using* footer naming the agent to every message, so a message sent through it already discloses that an agent wrote it.
