# Blog style guide

The rules every blog post in `src/content/blog/` must follow.
Read this file before writing OR editing any post.
After writing, audit the draft against this guide and fix any violations.

---

## Hard rules (zero tolerance)

These have come up as explicit corrections. Don't reintroduce them.

### 1. No em dashes (—) or en dashes (–) used as punctuation
Use commas, periods, or restructure the sentence. Searches for `—` and `–`
must return zero hits across `src/content/blog/`.

### 2. No fabricated facts
Never state:
- Customer counts ("300+ companies", "10k users")
- Build timelines for a specific product ("Productlogz was built in two weeks", "Quotesmatic shipped in a weekend")
- Endorsements, partnerships, integrations, awards, or features that haven't been confirmed
- Specific revenue, conversion rates, growth multiples, or efficiency numbers ("3x faster", "saved $40k")

If unsure, soften ("a handful", "roughly", "some") or restructure to avoid
the claim. **When in doubt, leave the number out.**

### 3. Productlogz was built before the AI wave
Don't describe Productlogz with AI-build timelines, AI-assisted features, or
"built fast with AI" framing. It's the original Pillexis product, built the
long way. Everything that came after stands on top of it.

### 4. Plain English only — banned words and replacements
Don't use jargon, tech-speak, or business-school nouns. Replace with the
plain word a 15-year-old would actually say.

| Don't use | Use instead |
|---|---|
| scaffold (verb / noun) | set up, start the project, the starter code |
| hand-tuned | tweaked by hand, fitted to the team |
| extensible architecture | code built to be changed later |
| architecture (in tech sense) | design, shape, structure |
| abstraction | way of thinking about it, model |
| paradigm | way, approach |
| iterate (verb) | go back through, do another round, keep going |
| cycle (verb) | go through, work through, run through |
| compound (verb) | stack up, add up |
| optionality | the option to do it later, the choice you keep |
| cognitive load | mental work, mental tax, headspace |
| leverage (verb) | use |
| utilize | use |
| implement | build, make |
| facilitate | help, make easier |
| comprise / constitute | is, are |
| delta | change, difference |
| cohort | group, set |
| surface area | the size of the thing, how big it is |
| moreover / furthermore / consequently / thereby | start a new sentence instead |
| as such | drop it |
| in order to | to |
| in terms of | drop it |
| at the end of the day | drop it |
| best-in-class / world-class / cutting-edge / robust / seamless | drop it (marketing-speak) |
| synergy / scalable / next-gen | drop it (marketing-speak) |

Add new words to this list as we catch them.

---

## Voice

### First-person plural is default
"We" for studio-level statements. "I" for personal moments. Never "one"
or "the user" or "the customer". Address the reader as "you" or "your team".

### Declarative, not hedging
"The build is not the bottleneck." Not: "It could be argued that the build
may no longer be the primary bottleneck."

Hedging is fine when genuinely earned (e.g. "in our experience" once or
twice per post). Avoid every other "I think", "we believe", "perhaps".

### Show, don't tell
Bad: "AI is fast."
Good: "Code that used to take a week landed in an afternoon."

Don't make claims. Show what the claim looks like in practice.

### Specific beats abstract
Bad: "A bespoke solution maximizes workflow alignment."
Good: "A custom CRM that knows your sales pipeline has five stages, not
twelve, and skips the parts your team doesn't use."

---

## Structure

- **One-sentence opening.** Hook first. Don't warm up.
- **H2 sections only.** H3 only if a section is genuinely two layers deep.
- **One idea per paragraph.** Three sentences max in most cases.
- **Lists for enumerable items.** Use bullets over paragraphs when listing.
- **End with a CTA.** Link back to `/work-with-us` OR forward to the next
  post in the series. Don't end on a deflated note.

### Length target
1,000 to 1,500 words. If a post is shorter, it's probably underwritten.
If it's longer, it's probably padded. Trim ruthlessly.

---

## Frontmatter checklist

Every post must have:

```yaml
---
title: "..."           # under 70 chars
description: "..."     # 140-180 chars, ends with a hook
publishDate: YYYY-MM-DD
pillar: build-logs | studio-notes | distribution-diaries
author: anurag         # slug of an entry in src/content/authors/
tags: [4-6 lowercase, hyphenated tags]
readingTime: 6         # rough minutes, used as the displayed estimate
draft: false           # true while writing
---
```

Optional but encouraged: `updatedDate` when revising a published post
(signals freshness to Google).

---

## Process

### Before writing
1. Re-read this file.
2. Re-read the post being referenced (if it's a follow-up).
3. Re-read the relevant product page on the live site to ensure facts
   match what's actually shipped (productlogz.com, quotesmatic.com,
   migrainelogs.com, forge-project-overview.html).

### After writing
1. Search the post for `—`. Must return zero.
2. Search the post for the banned words above. Must return zero.
3. Check every numeric claim. If the number isn't verifiable, remove or soften.
4. Read the post out loud. If a sentence sounds clever instead of clear, rewrite it.
5. Build and verify (`npm run build`).

### Adding new rules
When the user corrects a phrase or pattern, add it to this guide so it
doesn't recur. The guide grows; the corrections don't.

---

## Pillar definitions

- **build-logs**: How we shipped what we shipped. Concrete process, specific
  decisions, what AI did and didn't do. First-person.
- **studio-notes**: Patterns across products. Thesis pieces. What we're
  learning as a studio. Often less specific than build-logs but more opinionated.
- **distribution-diaries**: Launches, what we tried, what worked, what
  didn't. Honest numbers (or honest "we don't know yet"). The studio's
  stated research focus.
