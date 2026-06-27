---
title: "Henry Ford Would Be Proud: We're Building a Software Factory"
date: 2026-06-26T00:00:00-04:00
draft: true
tags: ["ai", "software-factory", "agentic-sdlc", "engineering-leadership"]
description: "My org is building a pipeline of AI agents across the entire delivery lifecycle. Here's what that means and why we're doing it."
---

![The Software Factory floor](/images/software-factory-floor.png)

There's irony in software engineers building a factory. Engineers tend to see themselves as artisans. The code is their craft, the elegant solution is the point, and no two implementations should look the same. "Factory" implies the opposite. Standardized, repeatable, interchangeable. Assembly lines and shift work, not creative problem-solving. Whether all of that actually holds true is something I'll attempt to unpack over a series of posts, because I think some of the assumptions engineers may make when they hear "factory" may not match what this actually could look like in practice. But the word _does_ land with a huge thud. And yet here we are, eagerly and aggressively designing one.

Most conversations about AI in software development stop at the editor. An engineer opens a chat panel, describes what they need, and the model helps them write code faster. That's useful, and most teams are getting real value from it. But it solves one link in a much longer chain.

The bottleneck in software delivery was never typing speed. It's the full lifecycle. Requirements, refinement, implementation, testing, security review, documentation, integration, release. AI copilots accelerate one of those steps. The interesting question is what happens when you try to accelerate all of them.

In my organization, we're attempting an answer. We're building what we call a Software Factory, a pipeline of specialized AI agents, each handling a stage of delivery, each with its own quality rubrics and human checkpoints. This post is about what that means, why we're pursuing it, and what I've learned watching it take shape as an engineering manager.

---

## Where most teams are today

It's helpful to think about AI adoption in software delivery as a spectrum. Not every team is at the same point, and most don't realize there's a level beyond where they currently sit.

**One-shot, or "vibe coding."** Connect to a model and ship. This works for isolated tasks and prototypes. There are no conventions, no guardrails, and no feedback loops. Most individual AI usage lives here. It's fast, and it accumulates what I've seen people call "flash debt" just as quickly.

**The copilot pattern.** AI augments existing workflows. Engineers still own the code, still run reviews, still manage PRs. Conventions and guardrails exist. The model operates within the team's established process. This is where disciplined engineering orgs are today, and most think this is the destination.

**Beyond copilot.** What if AI didn't just help you write the code, but produced the implementation from a specification? What if the spec, not the code, was the primary artifact?

The gap between copilot and whatever comes next isn't obvious. Copilots feel like the endgame to a lot of people. "AI helps me code faster, what more is there?" The answer is that copilots don't solve the specification problem, the quality gate problem, or the cross-lifecycle problem. They make one step faster. A factory tries to rethink the whole chain.

---

## The direction we're taking

In Red Hat AI Engineering, the direction is an Agentic SDLC, a delivery model where AI agents participate across the entire software development lifecycle, not just in the editor.

The concrete form this takes is a Software Factory.

A quick terminology note, because these terms get conflated. An "AI Factory" is what our _customers_ build, a 5-layer ecosystem of infrastructure, models, data, agents, and applications for delivering agentic solutions. That's the product we sell. A "Software Factory" is how our _engineering org_ builds software. This post is about the latter.

This isn't a side project or a skunkworks experiment. It's the organizational direction. ASDLC adoption is listed as the #1 focus area in our leadership priorities. Enablement sessions have run across the org. Our VP of AI Engineering has presented the full vision, staffing model, and rollout plan.

### When it became real for me

For a while, the Software Factory was an idea in slide decks. It became more real as the core team driving the initiative began creating and demoing agents that emulate parts of our existing SDLC.

The turning point was the RFE creator. Our RFE (Request for Enhancement) process was elaborate, complete with an RFE Council, multiple review steps, and manual interventions across several systems. An RFE would come in on a Monday. By Thursday, if we were lucky, it had survived the council review, bounced back for revisions, gotten resubmitted, and maybe approved. The agent does the same triage in minutes, and it never forgets to check the feasibility criteria. Seeing that output at a quality level that matched what humans were doing helped me understand what it actually looks like to drive process through agents rather than through people following checklists.

There's a personal connection here too. I've been building [Argus](/posts/from-files-to-software/), my own AI productivity system, for months. Skills that auto-activate, domain knowledge that the model consults, session memory that carries context forward. The factory pattern is much closer to where I want Argus to eventually go, where I'm _only_ spending time on the highest-impact work while everything else happens autonomously or in an automated way. I'd only need to check in and approve at key moments. When things go wrong, I'd fix my system rather than tinkering with the work product.

### How the team is receiving it

My team gets it, but it's still abstract. "What will the work _be_?" is the question I hear most. Fair question - how we work, our roles, how we're evaluated, all of that changes with this shift. I don't have a complete answer yet, and I tell them that. What I do emphasize is that for us to succeed in this organization, we need to be all in. Half-adopting a factory is just extra process on top of the process you already have.

The tension between shipping current commitments and adopting a new delivery model is real. But the entire organization, PM and Engineering, understands and is involved in the transformation. At the org level we're beginning to make concessions as we look at future releases, understanding that new feature work will likely slow as we work out the kinks.

---

## So what is a factory?

The best way I've found to explain it is by contrasting it with the copilot model most people already know.

**In the copilot pattern**, AI augments your existing workflow. Engineers still own PRs, reviews, and iterations. The model helps you write code, but you're still the one driving. When the output is wrong, you fix the code.

**In the factory pattern**, agents produce implementation from specifications. If the output fails quality gates, you don't patch it. You improve the spec and regenerate. Engineers modify specs and agents, not product code directly. When the output is wrong, you fix the spec or the agent. The team driving the initiative calls this **"edit inputs, not outputs"** - never touch the generated code directly, because the pipeline will just regenerate it on the next run.

> The key mental shift is that in the factory model, the spec is the source of truth, not the code. Code is a generated artifact.

The factory isn't one agent doing everything. It's a pipeline. Each stage follows the same pattern:

1. **AI does the work** - assessment, generation, scoring, fixing
2. **Rubric-based quality gates** - scored dimensions, pass/fail thresholds
3. **Auto-revision loop** - if output fails, attempt self-correction
4. **Human review and sign-off** - nothing ships without a person approving it

It's a pipeline of scored agents with human checkpoints. Not an autonomous system that runs unsupervised.

---

## Why a factory?

The hypothesis is that by improving the quality of inputs (requirements into specifications), you can improve the scope, instructions, and validations for individual work items. Feeding those improved specs into agents that code, test, and evaluate repeatedly will drive better output across the board.

In plain language, garbage in, garbage out applies to agents too. The factory only works if the specifications are good. Which means requirements, refinement, and acceptance criteria become the most important work in the entire pipeline.

What you optimize for changes:

|  | Copilot | Factory |
|---|---|---|
| What engineers write | Code (with AI help) | Specs and agent configs |
| What you fix when output is wrong | The code | The spec or agent |
| How quality scales | Better engineers | Better specs + better agents |
| Bottleneck | Engineer time | Spec quality + agent capability |

### The real driver

Velocity is always the biggest driver in our industry. Of course velocity without quality makes the velocity do more harm than help, but the goal is to deliver value to customers as quickly as possible.

And the spec problem isn't theoretical. Lack of actual customer use cases, incomplete requirements, question marks when it comes to understanding process (where approvals are needed, who signs off on what) - these are the things that slow my team down on a regular basis. Implementation is rarely the issue. We have talented engineers who can build what's asked of them. The problem is usually that what's asked of them isn't well-defined enough.

The factory model makes specs the primary focus. If the spec is wrong, the generated code is wrong, and the quality gates catch it. You're forced to get the specification right because the pipeline won't produce good output otherwise.

### The human side

This is where leadership and management anticipate the most friction, and I'll be honest about that. While "engineers become spec writers" is true in the abstract, many engineers consider themselves artists, and the code is their art. Stepping back from direct implementation doesn't make people feel warm and fuzzy. It can feel like a loss, or perhaps a path toward failure.

The angle we discuss as leaders is that while the work looks different, time is spent on higher-value activity. Everyone moves closer to customer conversations, system design choices, and broader understanding of the product and the agentic AI space. The daily tasks change, but the importance of engineering judgment doesn't diminish. If anything, it concentrates.

### Why now?

There's honestly never a "good" time to transform how an engineering organization delivers software. But the pressures are real: release quality goals, delivery velocity expectations against headcount reality, QE/Dev culture shifting left, and the simple reality that the organization that builds AI products should be delivering with AI. If we believe in what we're building for customers, we should be willing to use the same approach ourselves.

---

## What's next

This post describes what a Software Factory is and why an engineering org would pursue one. It doesn't describe what the pipeline actually looks like in practice, stage by stage, with the evidence and the honest gaps.

That's the next post. I'll walk through what's active, what's working, and what we haven't built yet.

If you're an engineering leader thinking about whether AI changes delivery beyond "help me code faster" - it does, and this is one version of what that looks like. If you're an engineer wondering what the work becomes - honestly, so am I. That's part of what makes it interesting.

---

*Author: Christopher Bynum · AI-assisted drafting (Claude Opus 4) · Human-directed, human-reviewed*
