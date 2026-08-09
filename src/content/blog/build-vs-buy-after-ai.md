---
title: "Build vs buy, after AI: the new break-even math"
description: "The build-vs-buy decision used to hinge on engineering cost. Now it hinges on the shape of the feature surface. Here's how to actually think about it."
publishDate: 2026-04-15
pillar: studio-notes
author: anurag
tags: [ai, build-vs-buy, custom-tools, saas, cost]
readingTime: 7
draft: false
---

The previous two posts in this series argued that most SaaS tools are paid mostly for features your team never touches, and walked through what an AI-assisted build of a narrow custom tool actually looks like.

This post is the one that ties it together. When is "just build it" the right call, and when is it still wrong? The decision used to be simple. It isn't anymore, and the new math is what trips most teams up.

## The old math

For most of the last decade, the build vs buy decision was straightforward.

The cost of building was: engineers × months × loaded cost. A small workflow tool was at minimum two engineers for one to three months, plus ongoing maintenance forever. Even at modest rates, that's tens of thousands of dollars upfront and a real ongoing tax.

The cost of buying was: per-seat license × team size × however many years. Typically a few hundred dollars a month for a small team. The numbers landed cleanly in favor of buying, almost always, almost no matter what.

The only times build won were the obvious ones: you had a workflow so weird no vendor could serve it, or you had so much scale that the per-seat math eventually flipped, or there genuinely was no product on the market.

For everyone else, the math was so lopsided that the question was barely worth asking. Buy.

## What changed

The build side of the equation collapsed.

A focused person plus AI tooling can now build a narrow workflow CRUD tool, end to end, in a small number of focused sessions. Not a prototype. The thing you'd actually use in production for the next year, with tests, with a deploy pipeline, with the data model you'd choose.

The per-seat SaaS cost didn't change. The build cost did. By a factor of something like 10x to 20x, depending on the tool.

That means the break-even point moved. Tools that used to be obvious "buy" decisions are now in a grey zone. Some tools that were marginal "buy" decisions are now "build" decisions.

The right way to think about it now isn't to recompute the old formula with a smaller build number. It's to look at the *shape of the feature surface* of the tool and ask which side of a line it sits on.

## When buy still wins

Some categories haven't moved. If a tool falls in one of these, the answer is still "buy" and it's not close.

**Deep feature surface you'd genuinely use.** Some tools are deep, and that depth is the product. Notion has hundreds of features and your team probably uses 40 of them in real ways, because the depth is what enables the workflows. Same for Linear, Figma, Excel, Photoshop. The "audit how many features you use" trick doesn't expose much waste here. The shape of the surface is wide because you're actually walking across the whole surface.

**Network effects.** You don't build LinkedIn. You don't build Stripe. You don't build a Calendar that lets you book meetings with people who aren't on your system. The software is incidental. The network is the product. No amount of build velocity helps here.

**Compliance and regulation.** Payroll. Tax filing. Audit logging. Identity verification. Anything where the cost of being wrong is "the government writes you a letter" or "your customers sue you." Buy from a vendor whose entire business depends on getting this right. Always. Don't be clever.

**Feature velocity you can't match.** Search, fraud detection, anti-spam, email deliverability, ML-powered anything where the vendor has dozens of engineers continuously improving the model. The vendor's investment stacks up over the years. Yours won't. Buy.

**Critical reliability.** If the tool is on the path of "if this goes down, the business stops," and you're a small team, the vendor's SRE org is the thing you're really paying for. Buy.

## When build now wins

The other side of the line is where things genuinely shifted in the last 18 months.

**Workflow CRUD tools.** CRMs. Project trackers. Content calendars. Booking systems. Inventory dashboards. Anything where the core data model is a handful of entities with a handful of fields each, and the value is in matching your team's specific workflow. The 12-features-vs-200 problem is most acute here, and the build cost has collapsed the most here.

**Internal dashboards and reporting.** The finance view your CFO actually wants. The ops dashboard that surfaces the six numbers that matter. The on-call summary pulled from your specific stack. BI tools are flexible and slow to configure. The custom version is opinionated and ships fast.

**Narrow business-specific tools.** Anything where the "weird rule that's unique to our business" is more than half the value. Invoice generators with your country's tax quirks. Inventory tools with your SKU schema. Compliance checklists with your regulator's exact wording. These are too specific for any vendor to build well and small enough for AI-assisted custom to ship.

**Tools that started narrow but accumulated features.** The category to actually look at. Most "SaaS bloat" started life as a tight tool that did one thing well. Then they added features to win comparison checklists. The original narrow version is often the only version you needed. Check whether what you actually want is the 2019 version of the tool with three features stripped out. That's a build candidate.

## The grey zone

Plenty of tools sit in the middle.

Email marketing platforms. Help desks. Form builders. Knowledge bases. These have deep-enough surfaces that build looks expensive, but most teams use the narrow center of the feature set and pay full price for the long tail they ignore.

For these, the test isn't theoretical. It's the audit from the first post in this series. Pull up the analytics. Count the features your team has actually used in the last 90 days. If the number is small and the workflow is yours, the build math now works. If the number is big or the workflow is generic, buy.

## The maintenance reality check

The most common pushback to "just build it" is: but then you have to maintain it.

True. And worth pricing in honestly.

For a 12-feature internal CRUD tool, real maintenance over a year looks like:

- A handful of dependency updates per quarter.
- One or two real workflow changes per year, each of which is itself a short AI-assisted round of changes.
- Occasional small bug fixes when something breaks.
- Periodic backups and infrastructure check-ins.

That's hours per quarter, not days per month. For a small internal tool replacing a SaaS subscription, the maintenance cost is genuinely smaller than the per-seat license over the same period, and you get all the workflow-fit benefits on top.

For a 60-feature production system with thousands of users, the maintenance story is completely different. Don't build that. Buy that. Or use the open-source equivalent and contribute back.

The art is in knowing where on that continuum your candidate sits. The honest answer is: most teams have a handful of workflow tools that fall on the right side of the line, and most of the rest of their stack genuinely should stay bought.

## A decision worth running

The old "build vs buy" memo is out of date. The numbers have moved.

If you haven't done the audit recently, do it once. Open your SaaS tools, count the features your team actually uses, look at the bill you're paying, and ask honestly: for each tool, is this a 12-features-or-fewer workflow CRUD candidate, or is it genuinely deep / network-based / regulated?

For the ones that come out on the wrong side, the cost of staying on the SaaS isn't just the bill. It's the mental tax on your team, the seat-based pricing for users doing one thing, the integration debt, and the workflow drift over time.

For the ones that come out as build candidates, the cost has genuinely fallen by an order of magnitude. The conversation worth having is which one to start with.

If you'd like help running that audit on your stack, [reach out](/). It is the first step in one of our fixed scope engagements, and most teams come out with a list of two or three real build candidates and a clearer story for the rest of the stack.

Three posts in, the thesis is simple. Most teams are paying for a lot of software they don't really use. AI didn't change which features they need. It changed which features they can now afford to build.
