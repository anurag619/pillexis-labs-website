---
title: "Inside the build: a custom CRM, in an afternoon"
description: "A walk through the actual process. PRD first, hard-code the workflow-specific bits, milestone the build, ship the 12 features that matter."
publishDate: 2026-03-25
pillar: build-logs
author: anurag
tags: [ai, custom-tools, crm, workflow, build-log, prd]
readingTime: 8
draft: false
---

The previous post in this series argued that most SaaS pricing pays for features your team never touches, and that building the 12 features they actually use is now a weekend, not a quarter.

This post is the how.

The example is a custom CRM, because it's the most common one we get asked about. The same pattern works for a project tracker, an inventory tool, an internal dashboard, anything where the surface area is a handful of CRUD views and the value is in matching your team's workflow exactly.

There's a great walkthrough of this approach by Brian Castle on YouTube ([build a custom CRM with AI](https://www.youtube.com/watch?v=s1iwU5OlIOE)) that covers the same ground from a slightly different angle. Worth watching as a companion piece.

Here's the version we use.

## Step 1. The PRD is the whole game

Before any code, you write a one-page PRD.

Not a three-page PRD. Not a thirty-page enterprise spec. A one-page document that answers four questions:

1. **Who is this for and what do they do today?** ("This is for our sales lead. Today they live in a spreadsheet plus a paid CRM they only use for the kanban view.")
2. **What does the tool do?** ("Contacts, deals with a kanban pipeline, activities log, follow-up reminders. That's it.")
3. **What does it explicitly NOT do?** ("No email integration. No marketing automation. No multi-tenant. No custom fields UI. No public API.")
4. **What does the data model look like?** Four entities, maybe five. List them.

The "explicitly NOT" section is the most important one. It's where you push back on every reflex to add another feature "while we're at it." Every item on that list is a decision you don't have to make later, code you don't have to write, and a button your team won't have to ignore.

Write the PRD in HTML or markdown, whichever you prefer. The format matters less than the discipline. If you can't get the whole thing to fit on one screen, the scope is wrong, and the AI will happily build the wrong thing in exquisite detail if you let it.

## Step 2. Hard-code the workflow

This is the move that saves you 80% of the work.

In a SaaS CRM, every field, every pipeline stage, every status label, every workflow rule has to be configurable. Why? Because the vendor doesn't know your business. Their UI has to support a thousand different sales processes. That configurability is where most of the UI complexity, settings pages, and admin overhead lives.

You don't have that problem. You know your business. You know your pipeline stages are *Inbound → Qualified → Demo → Proposal → Closed*. You know your activity types are *Call, Email, Meeting, Note*. You know your contact statuses are *Cold, Warm, Customer, Churned*.

Hard-code all of it.

Not in a config file you might change later. In the source. As enums. As constants. As switch statements. As "if status === 'Demo' show the orange chip" code that you'd never write in a product meant to be sold to other businesses.

This is the part that makes seasoned product engineers wince. You're throwing away the "flexible code" pattern they spent years learning to build. That's the point. Flexible code is a feature you're paying for when you don't need it. You don't need it. You need a CRM that fits your sales pipeline today. If your sales pipeline changes in 18 months, you'll change the code in an afternoon.

The hard-coded version takes one third of the time to build and is dramatically simpler to use.

## Step 3. Milestone the build in dependency order

You don't ask AI to "build the CRM."

You break the build into milestones in the order they have to be built. The dependency order matters more than the priority order. You can't ship the kanban view before contacts exist. You can't ship reminders before tasks exist. The right sequence falls out naturally if you draw the data model first.

For the CRM, the milestone list looks something like:

1. **Project setup + data model.** Set up the project, create the database, define the entities.
2. **Auth + your team.** You're the only users. A single-tenant login. Don't build a registration flow.
3. **Contacts CRUD.** Create, edit, list, search. The boring foundation.
4. **Deals CRUD.** Linked to contacts. The pipeline stage is one of your hard-coded enums.
5. **Kanban view.** The deals list, but grouped by pipeline stage with drag-to-move.
6. **Activities.** Log a call, email, meeting, note against a contact or a deal.
7. **Tasks + reminders.** A simple "follow up by Friday" with a daily email or in-app notification.

Seven milestones. Each one ends with something you can use. By milestone 4 you have a working CRM, technically. Milestones 5, 6, 7 are the difference between "working" and "actually nice to use."

## Step 4. Let AI do the typing

For each milestone, you write a short brief. Two paragraphs. What the milestone does, what it explicitly doesn't do, what the relevant entities and fields are, and a pointer to the PRD as the source of truth.

You hand that brief to whichever AI coding tool you trust. Claude Code, Cursor, Codex, whichever fits the way you work. The tool generates the code. You read the code, run it, check it does what the brief said. You ask for changes. The tool runs another round.

The thing that surprises people the first time they do this is how much *thinking* they're still doing. The typing is gone. The decisions are not. Every milestone you're deciding: is this the right shape for the deals page? Is this enum complete? Did the AI add a "tags" field nobody asked for and should I tell it to remove that?

The job is no longer writing code. The job is reading code carefully, holding the PRD in your head, and refusing things that drift.

If the AI suggests "while we're here, let me add a settings page for custom fields", say no. That's the SaaS reflex. You're not building SaaS.

## Step 5. Ship the rough version. Then use it for a week.

Don't polish. Don't add the seventh feature. Don't try to predict the next thing your sales lead will ask for.

Ship the version that does the 7 milestones. Hand it to the person who'll actually use it. Tell them: "Use this for a week. Write down every moment you wished it did something differently."

The list they bring back will be short. Most of it will be UI adjustments. Some of it will be one or two real workflow gaps you genuinely missed. Almost none of it will be the things you would have predicted if you'd tried to design for everything upfront.

Then you do another short build round for the real gaps. Now the tool fits.

Total elapsed time on the build: anywhere from a focused afternoon (if you've done this before and the data model is simple) to a long weekend (if it's your first time and you're learning the pattern as you go). Either way, dramatically less than the per-seat license over the lifetime of the tool, and you own the thing.

## The shape of the win

When this works, you end up with:

- A tool that fits your team's actual workflow, not the average of every team's workflow.
- No per-seat pricing. Add the intern, the accountant, the part-timer. They cost nothing extra.
- No feature requests to a vendor. Need it? Build it. Hand the change request to the AI. Ship it.
- A maintenance cost that's hours per quarter, not days per month.
- Total ownership of the data, the workflows, the future changes.

The trade-off is real. You're now the vendor. If the tool breaks, you fix it. If the dependencies need updating, that's on you. If a key team member leaves and they were the one who knew the codebase, that's a risk.

For a 12-feature internal CRUD tool, those trade-offs are small. For a 60-feature production system, they're not. The art is in knowing which side of that line a given tool falls on.

The next post in the series gets into exactly that. The build vs buy decision, with the post-AI math.

If you're thinking about replacing one of the bloated SaaS tools your team is currently paying for with something narrower and built for you, [talk to us](/). We do this work for D2C teams as one of our two-sprint engagements.
