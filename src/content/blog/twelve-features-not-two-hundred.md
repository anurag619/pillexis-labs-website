---
title: "You don't need that SaaS. You need the 12 features your team actually uses."
description: "Most SaaS pricing pays for features nobody touches. With AI, building the 12 your team actually clicks is now a weekend, not a quarter."
publishDate: 2026-03-04
pillar: studio-notes
author: anurag
tags: [ai, custom-tools, saas, internal-tools, build-vs-buy]
readingTime: 6
draft: false
---

There's an audit nobody runs.

Open the SaaS tool your team is currently subscribed to. Pull up the analytics, the audit log, the activity feed, whatever shows you which buttons your team has actually clicked in the last 90 days.

Count the distinct features they touched.

For most tools, the number lands somewhere between 8 and 15.

The tool has 200.

You're paying for 185 of them to exist, mostly so that the vendor has a comparison page that beats the next vendor on a checklist nobody reads.

## The features you don't use are not free

It's tempting to think the unused 185 features cost nothing. They're there if you ever need them. The option to use them later, just in case.

That's not how the bill actually works.

The unused features cost you in three ways that don't show up on the invoice.

**Mental tax.** Every new team member spends their first week figuring out which of the 200 buttons are the ones your team actually cares about. The vendor's onboarding doesn't know this. Your senior person ends up writing an internal doc called "ignore these 14 menus, here's the 3 we use." That doc rots.

**Seat-based pricing for users who do one thing.** The marketing tool charges per seat. The accountant only logs in once a month to export a CSV. The intern only needs to update one field. You pay full price for both, because the vendor's "view-only" tier doesn't let them do the one thing they actually need to do.

**Integration debt.** Each SaaS tool wants to be the center of gravity. None of them are. So you end up with a Zapier graveyard, a paid Make subscription, and a half-finished n8n setup duct-taping the tools that don't talk to each other natively. The integration layer becomes its own tool you're managing.

The 200-feature tool is the right answer for a vendor optimizing for "we have every feature you might ever want." It's almost never the right answer for the team using it.

## What changed

Two years ago, the argument against "just build it" was simple. Building the 12 features your team needs was a Q1 project. Two engineers, four weeks of build time, ongoing maintenance forever. Compared to $40/seat/month, the SaaS was almost always cheaper, even before you factored in time-to-value.

That math broke last year.

Building 12 narrow features with AI in the loop is no longer a Q1 project. The starter code lands in a session. The data model comes from a one-page PRD instead of a sprint planning meeting. The UI gets tweaked by hand to fit your actual workflow, because there's no marketplace pressure to make every field configurable. Testing comes along for the ride, generated alongside the code.

The thing that used to take weeks now lives somewhere between a focused afternoon and a long weekend, depending on scope. Maintenance is real, but it's "hours per quarter" real, not "an engineer keeping the lights on" real.

The break-even point shifted by an order of magnitude. The question isn't "is custom worth it" anymore. The question is "is this the kind of tool where custom now wins."

## When custom now wins

Three categories are clearly tipping toward "just build it":

**Workflow CRUD.** A CRM that matches your exact pipeline. A project tracker that only has the columns your team uses. A content calendar that knows your specific publishing process. These are 80% the same across companies, but the last 20% is where every team has its own weird rule, and that's where off-the-shelf tools cost you the most. Custom owns this category now.

**Internal dashboards.** The reporting view your finance person actually wants. The ops dashboard that surfaces the 6 numbers that matter for your business. The on-call view that pulls from your specific stack. Off-the-shelf BI tools are powerful and slow to configure; the AI-built version is opinionated and fast to ship.

**Narrow tools with business-specific rules.** Inventory tracking with your unique SKU schema. Invoice generation with your country's tax quirks. Compliance checklists with your regulator's exact language. These tools are too specific for any vendor to build well, but small enough that one person plus AI can finish in a few sittings.

## When SaaS still wins

The argument isn't "build everything." There are categories where buying still wins by a wide margin.

**Deep feature surface that you'd actually use.** Notion has hundreds of features and you genuinely use 60 of them. Slack has the network you need to be on. Linear's keyboard shortcuts took years to refine and your team would notice if they were missing. Build only when the surface is small.

**Network effects.** You don't build LinkedIn because LinkedIn isn't software, it's the people on it. Same for Stripe (the payment network, not just the code).

**Compliance and regulation.** Payroll. Tax filing. SOC 2 audit logging. Buy. Always.

**Feature velocity you can't match.** Best-in-class search, fraud detection, anti-spam. Tools where the vendor has 50 engineers improving the model every week. You won't catch up. Buy.

The discipline is in the cut. The temptation, once you discover you can build narrow workflow tools cheaply, is to try to build everything. Don't. Most companies should build maybe 3 to 5 custom internal tools and buy the rest.

## So what do you actually do

The boring answer is: do the audit.

Pick your top three most-used SaaS tools. For each one, open it on a Friday afternoon and write down the features your team has actually used in the last 30 days. Just the verbs. "Created a deal." "Logged an activity." "Sent a reminder." "Exported the report."

The list will be shorter than you expect. It's almost always shorter than you expect.

Then ask the harder question: are any of these tools eating more than $500/month for what is, in practice, a 12-feature internal CRUD app?

If yes, you have a build candidate.

We do this work for Indian D2C teams who've outgrown their stack. If the audit you just ran turned up something painful, [talk to us](/). We'll help you scope which tools are real build candidates and which to leave alone.

In the next post in this series, I'll walk through what the actual build looks like, using the example of a custom CRM. The pattern is the same for almost every workflow tool: PRD first, hard-code what your team actually does, milestone the build, let AI do the typing.

The 12 features have always been the ones that mattered. Now they're the ones you can have.
