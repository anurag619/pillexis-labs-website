---
title: "Four products in, here's what AI still can't do"
description: "Four products later, the bottleneck moved. AI handed us the build. It did not hand us anything else."
publishDate: 2026-06-22
pillar: studio-notes
author: anurag
tags: [ai, distribution, indie, shipping]
readingTime: 7
draft: false
---

We started Pillexis Labs to find out what's left for humans to build now that AI can build almost anything. The honest way to answer that question isn't to argue about it. It's to ship things, watch where they break, and write down the gaps.

Four products in, the gaps have shape.

## What we shipped

In rough order:

- **[Productlogz](https://productlogz.com).** Feedback boards, voting, public roadmaps, and changelogs for SaaS teams. The original Pillexis product, built before the AI wave changed everything, the long way around, line by line. It still runs, still pays its way, and still teaches us about the SaaS feedback loop. Everything that came after stands on top of it.

- **[Quotesmatic](https://quotesmatic.com).** A daily mindset app for iOS. You define a future self, write one sentence in your own voice that they'd say, and live with it for a week across seven different rituals. Not a quote feed. Not affirmations.

- **[Migraine Logs](https://migrainelogs.com).** A voice-first migraine tracker for iOS and Android, built for use *during* an attack, not just after. Auto-attached weather, sleep, and heart rate so triggers surface from real life. Pre-launch as of this writing.

- **Forge.** A native macOS desktop app for running fleets of AI coding agents. Each agent gets its own isolated git worktree, with Linear, GitHub, and Slack baked in, WebGL terminals, and a binary under 10 MB. v0.1, very experimental.

Four products. Four different domains. SaaS, consumer mindset, health, developer tooling. We didn't plan that diversity. It's the natural result of building fast enough that you can follow whichever idea is loudest that week.

## What AI did

AI built almost all of the new work.

Code generation, refactors, test setup, schema migrations, build pipelines, the long tail of "I know what I want but typing it would take a day". AI handled all of that across every product. Cursor and Claude Code did the bulk. Some weeks I felt more like a director of a small team of AI engineers than a developer myself.

The shape of the work shifted. The bottleneck used to be typing code. Now it's deciding what to type. Ideas that used to live across weeks of evening hours started taking shape inside a single focused session. The thing that surprised me most wasn't the speed itself. It was that the speed didn't matter on its own. The same problems that used to live on the far side of a long build now lived on the near side of a short one. They had to be solved anyway.

The build is not the bottleneck. Not anymore.

## What AI did not do

Here's where the four-product sample gets interesting.

**AI did not pick the audience.** For each product I had to spend hours alone with a notebook deciding who, exactly, this is for and who it is not. Productlogz is for SaaS founders who'd rather ship what users actually want than argue about it in a doc. Migraine Logs is for the person whose neurologist keeps asking for data they don't have. Those sentences were not generated. They were extracted.

**AI did not name the products.** Every product name took a day. AI suggestions sounded like AI suggestions, vaguely on-theme, slightly wrong, instantly forgettable. The names that landed were ones a human stared at, hated, tried out loud on a friend, and revised.

**AI did not earn trust.** Health software needs people to believe you before they hand you their data. SaaS tools need someone willing to be the first customer. None of that came from a prompt. It came from real conversations, real prototypes, and real moments where someone said "yes, that's exactly the thing I needed."

**AI did not pick the cut lines.** Every product could have a thousand features. The version that gets used has a handful. Every product we've shipped has involved more decisions about what to *not* build than what to build. AI happily generates everything you ask for. The discipline of refusal is still entirely yours.

## The 80/20 we keep seeing

We've talked publicly about an 80/20 split. AI builds. Humans launch. After four products, that ratio isn't a guess anymore. It's the shape of every week.

Roughly 80% of the work that turns an idea into working software is now AI-accelerated. Code, starter setups, schemas, refactors, the daily grind of construction. AI compresses that work meaningfully.

The remaining 20% is where almost all the calendar time now sits. Naming. Scoping. Positioning. Deciding what to cut. Deciding who to pitch first. Writing the homepage. Choosing the price. Finding the first user. Earning the right to be in their feed. None of that 20% has been touched by AI in any meaningful way. There are tools that *claim* to help with marketing. None of them have moved the needle for us.

This is the gap.

## What we're doing about it

The thing we keep finding is this. The build is no longer the constraint, but the surrounding work has not been compressed at all. So that's where we're spending our research time now.

Distribution. Positioning. The daily grind of getting found. The cold-start problem for AI-built products specifically, the products that were built faster than the founder's audience can grow.

There's a product in that, and we're looking at it. We don't have a name yet, won't for weeks, because the name is part of the 20%.

If you're shipping AI-built products and hitting the same wall, we'd genuinely like to hear what's working for you, what isn't, and where you're stuck. That's research material. [Drop us a line](/).

---

*Four products in. The build is solved. The next thing is not.*
