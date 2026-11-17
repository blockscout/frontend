# Slack summary

Russian, one message to the frontend channel, sent without a draft round: every line comes from a row the
developer approved in the plan. Issue links are Slack-formatted links, `<url|text>`, so the bullet's
title is the link and no bare URL touches the next line. The recording link is the only bare URL, and a
blank line follows it. Placeholders in angle brackets are filled in step 5 of `debrief-meeting`, after
the issue writes exist. A block with nothing to list is dropped, heading included.

```
Итоги фронтенд-синка <дата>
<ссылка на запись>

По задачам:
• <<ссылка на issue>|#<номер> <название>> — <решение в одну фразу>
• ...

Обновили описание:
• <<ссылка на issue>|#<номер> <название>>

Новые задачи:
• <<ссылка на issue>|<название>>

Action points:
• <@U…> — <что сделать>
```
