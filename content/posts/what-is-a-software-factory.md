---
title: "Henry Ford Would Be Proud: We're Building a Software Factory"
date: 2026-06-26T00:00:00-04:00
draft: false
tags: ["ai", "software-factory", "agentic-sdlc", "engineering-leadership"]
description: "My org is building a pipeline of AI agents across our entire delivery lifecycle. Here's what that means and why we're doing it."
---

![The Software Factory floor](/images/software-factory-floor.png)

There's irony in software engineers building a factory. Software engineers carry the stigma of being "white collar" and they tend to see themselves as artisans. The code is their craft and constructing an elegant solution is the point, and generally speaking, no two implementations should look the same. "Factory" implies the opposite, something standardized, repeatable, and interchangeable. People hear "factory" and picture assembly lines and shift work, which feels a long way from the craft engineers signed up for. I think it's fair to wonder how the workday changes and what our jobs will actually look like, and I'll try to unpack that over a series of posts. But I have to admit, saying "factory" in a room full of software engineers is like showing up to a black-tie event in a pink tux. And yet here we are, eagerly and aggressively designing one, so surely there's something to it. Right?

Say "AI in software development" and most people picture the same thing. An engineer with a chat panel, writing code faster. That's useful, and most teams are getting real value from it. But it solves one link in a much longer chain.

The bottleneck in software delivery was never typing speed. It's the full lifecycle, from requirements and refinement through implementation, testing, security review, documentation, and release. AI copilots accelerate one of those steps. The interesting question is what happens when you try to accelerate all of them.

In my organization, we're attempting an answer. We're building what we call a Software Factory, a pipeline of specialized AI agents, each handling a stage of delivery, each with its own quality rubrics and human checkpoints. This post is about what that means, why we're pursuing it, and what I'm learning as I watch it take shape.

---

## Moving beyond copilot

It's helpful to think about AI adoption in software delivery as a spectrum. Not every team is at the same point, and most don't realize there's a level beyond where they currently sit.

**One-shot, or "vibe coding."**

It's 11pm, you have a demo tomorrow, and you need a script that pulls data from three APIs. You open a chat, describe what you need, copy the output into your repo, and push. It works, and you don't look too closely at _how_ because you haven't built in any conventions to catch you, no guardrails, no feedback loops to tell you something's off. Most individual AI usage lives here, and it accumulates a type of **"flash debt,"** technical debt that builds up quickly and silently because nobody stopped to question the output.

**The copilot pattern.**

Your team has adopted Cursor or Copilot and engineers use it every day, but they still own every PR, still review every line of code, and the process around them hasn't changed at all. Things move faster without the work itself looking any different. Most disciplined engineering orgs are here, and most think this is the destination.

**Beyond copilot.**

You write a spec for a feature, hand it to an agent, and get back a working implementation with tests. The output isn't perfect, so you refine the spec and regenerate. If that sounds a bit bizarre or even uncomfortable, you're not alone, but that's where this is heading.

The gap between copilot and this next step isn't obvious. Copilots feel like the endgame to a lot of people. "AI helps me code faster, what more is there?" The answer is that copilots don't solve the specification problem, the quality gate problem, or the cross-lifecycle problem. They make one step faster, and a factory tries to rethink the whole chain.

---

## An Agentic SDLC

In Red Hat AI, the direction is an Agentic SDLC, a delivery model where AI agents participate across the entire software development lifecycle, from requirements through release.

The concrete form this takes is a Software Factory.

A quick terminology note, because these terms get conflated. An "AI Factory" is what our _customers_ build, a 5-layer ecosystem of infrastructure, models, data, agents, and applications for delivering agentic solutions. That's the product we sell. A "Software Factory" is how our _engineering org_ builds software. This post is about the latter.

This isn't a side project or a skunkworks experiment, it's the organizational direction. ASDLC adoption is the #1 focus area in our leadership priorities, with enablement sessions running across the org and engineering leaders driving the vision, staffing model, and rollout plan.

### Not just "slideware"

Early on, it felt like the Software Factory was an idea in slide decks. It became more real as the core team driving the initiative began creating and demoing agents that emulate parts of our existing SDLC.

The turning point for me was seeing the RFE creator. Our RFE (Request for Enhancement) process was elaborate, complete with an RFE Council, multiple review steps, and manual interventions across several systems. An RFE would come in and then work its way through council review, bounce back for revisions, get resubmitted, and eventually get approved if we were lucky. The agent does the same triage in minutes, and it never forgets to check the feasibility criteria. Seeing that output at a quality level that exceeded what humans were doing helped me understand what it actually looks like to drive process through agents rather than through people following checklists.

There's a personal connection here too. I've been building [Argus](/posts/from-files-to-software/), my own AI productivity system, for months. Skills that auto-activate, domain knowledge that the model consults, session memory that carries context forward. The factory pattern is much closer to where I want Argus to eventually go, where I'm _only_ spending time on the highest-impact work while everything else happens autonomously or in an automated way. I'd only need to check in and approve at key moments, and when things go wrong I'd fix my system rather than tinkering with the work product.

### Bringing the team along

In my 1:1 conversations with my team, I can tell they "get it", but it's still abstract. "What will the work _be_?" is the question I hear most. Fair question. How we work, our roles, how we're evaluated, all of that changes with this shift. I don't have a complete answer yet, and I tell them that. What I do emphasize is that for us to succeed in this organization, we need to be all in. Going halfway actually works against you. One foot in and one foot out means you're carrying the overhead of a new model without any of the payoff, and frankly, the engineers who lean in hardest are the ones best positioned for what comes next in this industry.

Shipping current commitments while adopting a new delivery model isn't easy. But the entire organization, PM and Engineering alike, understands and is involved in the transformation. We're already making concessions as we look at future releases, accepting that new feature work will likely slow as we work out the kinks.

---

## What makes it a "factory"

The team driving the initiative calls it **"edit inputs, not outputs."** You write a spec, feed it to a pipeline of agents, and get back a working implementation. The spec is the source of truth and the code is a generated artifact. When the output isn't right, you improve the spec or the agent, not the code. Editing generated code directly is an anti-pattern because it works against the whole point of having a pipeline.

The factory isn't one agent doing everything, it's a pipeline where each stage follows the same pattern:

![Factory pipeline pattern](/images/factory-pipeline-pattern.png)

It's a pipeline of scored agents with human checkpoints. Nothing runs unsupervised.

---

## Why a factory?

The hypothesis is that by improving the quality of inputs (requirements into specifications), you can improve the scope, instructions, and validations for individual work items. Feeding those improved specs into agents that code, test, and evaluate repeatedly will drive better output across the board.

In plain language, garbage in, garbage out applies to agents too. The factory only works if the specifications are good. Which means requirements, refinement, and acceptance criteria become the most important work in the entire pipeline.

What you optimize for changes:

![Copilot vs Factory comparison](/images/copilot-vs-factory.png)

### Implementation was never the bottleneck

Velocity is always the biggest driver in our industry. Of course velocity without quality does more harm than help, but the goal is to deliver value to customers as quickly as possible.

And the spec problem isn't theoretical. Lack of actual customer use cases, incomplete requirements, question marks when it comes to understanding process (where approvals are needed, who signs off on what) - these are the things that slow my team down on a regular basis. Implementation is rarely the issue. We have talented engineers who can build what's needed. The problem is usually that what's needed isn't quite well-defined enough by the time the requirements reach them.

The factory model makes specs the primary focus. If the spec is wrong, the generated code is wrong, and the quality gates catch it. You're forced to get the specification right because the pipeline won't produce good output otherwise.

### Selling artists on the assembly line

This is where I anticipate the most friction, and we all need to be honest when we discuss this. I believe an obvious concern is identity. For engineers who see their code as their craft, stepping back from direct implementation can feel like being commoditized, like the thing that made you valuable just became automatable.

But that's only part of the story. Engineering has always been rewarding because of deep immersion, hours disappearing into a hard problem, the satisfaction of understanding a system well enough to reshape it. AI-assisted work replaces that with a different cognitive mode where you're prompting, evaluating, and context-switching between your mental model and the model's output. The work isn't harder, but the parts that most engineers find _rewarding_ have been replaced with supervision.

Then there's what I'd call the **understanding gap**. When you write code yourself, you build a mental model that pays dividends every time you debug, every architecture discussion, every judgment call about tradeoffs. When you generate code with AI and review it, the understanding is shallower, and you end up shipping faster while knowing less about what you shipped. Engineers feel that as a loss of confidence, and it's not irrational.

I don't have satisfying answers to any of this yet, and I don't think anyone does. The factory isn't in full swing. There's a very real possibility that the new model doesn't work out to meet all of it's lofty dreams, or that engineers simply don't like the new way of working, or both. What's being asked of us right now is to walk this road in earnest because as a company we believe it will deepen our own understanding of how to apply AI in a forward-thinking way, and yield the best outcomes for our paying customers in the long run.

The messaging for my team is that yes, the work changes, but time shifts to higher-value activity. Everyone moves closer to customer conversations, system design choices, and broader product understanding. The daily tasks change, but engineering judgment matters more, not less, when you're writing the specs that drive an entire pipeline. I believe that, but I also think we make a mistake as leaders if we treat these concerns as resistance to be managed. If the factory optimizes for throughput and accidentally kills the things that make good engineers stay and care, the failure mode isn't slow delivery but disengaged delivery.

### Why now?

There's honestly never a "good" time to transform how an engineering organization delivers software. But the pressures are real. Release quality goals, delivery velocity expectations against headcount reality, QE/Dev culture shifting left, and the simple reality that the organization that builds AI products should be delivering with AI. If we believe in what we're building for customers, we should be willing to use the same approach ourselves.

---

## Stay tuned

This post describes our interpretation of a Software Factory and why we've chosen to pursue one. It doesn't get into what our pipeline actually looks like in practice, stage by stage, with evidence and the honest gaps.

That's the next post. I'll walk through what's active, what's working, and what we haven't built yet.

If you're an engineering leader thinking about whether AI changes delivery beyond "help me code faster," it does, and this is one version of what that looks like. If you're an engineer wondering what the work becomes, honestly, so am I. That's part of what makes it interesting.

---

<img src="/images/crafted-with-love.png" alt="Crafted with love" style="display:block;width:250px;margin:0 auto 4px auto;"><p style="text-align:center;margin:0;">*Author: Christopher Bynum · AI-assisted drafting (Claude Opus 4) · Human-directed, human-reviewed*</p>
