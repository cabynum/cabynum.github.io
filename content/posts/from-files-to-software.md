---
title: "Argus Has Outgrown Its Approach"
date: 2026-05-23
tags: ["ai", "agents", "architecture", "harness-engineering"]
description: "What happens after you've been running an AI productivity system for a while and you realize there's more to gain."
---

Six months ago I wrote about tearing down Argus, a multi-agent system I'd built inside Cursor; let's call it Argus v1. As it turns out, the agents I built in v1 were "fake". I know this sounds strange, but what I mean to say is I ultimately found that the agents I'd built around specific personas weren't actually utilized as a part of my workflows as I'd expected. We'll get to why that was the case a bit later. However, the skills and knowledge underpinning the agents were very much real. I kept those, deleted the rest of the system, and ended up with something simpler, let's call it Argus v2, that produced the same quality output.

I've been running this simpler version of Argus for months. It's almost entirely driven through markdown files. It works. It works quite well actually. But I, and in turn Argus, have new needs that I can't fix by simply writing better markdown. It's time for Argus v3.

---

## Argus v2

Argus is my personal engineering management command center. I use it every day for productivity at work. It runs inside Cursor as a collection of skills, knowledge files, and conventions.

I've developed a set of skills that provide me **on-demand context**. For example, when I say "run a hygiene audit," Cursor's skill discovery finds my hygiene-audit skill and activates a workflow file (markdown) that checks my team's Jira issues against 25 rules.

I've also built in **passive context**. An example of this is when I ask Argus "when is code freeze?". In this case a master knowledge routing table that I've developed as an "always-on" Cursor rule points to a knowledge file (markdown) referencing our product release schedule and the answer just comes back.

**Session continuity** carries context between conversations. I've built thin in the form of an append-only log that records what happened in each session. Separately, a priority list persists what I should be working on. Project memory files track where my long-running work left off in preparation for when I next engage in that particular workstream. Every working session starts by reading the last session's notes.

It was always a personal requirement of mine to be able to validate where information I receive back from my system originated. I built in **source provenance** which means every piece of domain knowledge traces back to a specific document with a date and an ID. When knowledge sources conflict, both positions/perspectives are recorded and acknowledged as conflicting until I resolve them.

The whole system is markdown files and conventions. No code. No database. No service. Just structured text that the LLM reads and follows. That's Argus v2.

---

## Cracks in the design

Up until now, I haven't experienced any _real_ problems. The system doesn't break in many obvious ways. But, the potential for Argus to degrade quietly is what bothers me, which might be much worse.

**Nothing enforces accuracy.** Everything in my system works because the LLM voluntarily follows the instructions I provide it. My routing table, driven through an "always apply" Cursor Rule, tells the model where to look for answers:

```markdown
| Question about                          | Read this                              |
|-----------------------------------------|----------------------------------------|
| Release dates, code freeze, GA timing   | `knowledge/jira/release-schedule.md`   |
| Hygiene rules (HYGIENE-XX, SPRINT-XX)   | `knowledge/jira/policy-rules.md`       |
| Health score, staleness, cadence scoring | `knowledge/jira/health-scoring.md`     |
```

If the model doesn't check the table, it answers from training data instead. I have no way to know whether it checked or the table or not. The answers _usually_ look right, but "looks right" and "came from the right source" aren't the same thing. There's no enforcement, no fallback, no visibility into what actually happened.

**Memory can be lost between sessions.** I've established a way of working with Argus that hinges on two primary Cursor Commands - argus.start and argus.end. The end command writes a summary of what happened during a working session - what got done, decisions made, where I left off - and it updates a list of priorities for me. The start command reads the last session's notes and current proirities, then it tells me where I left off and recommends what to do next. The setup is really nice and gives me a sense of control and order. It also is brittle.

If I forget to close a session, the log doesn't get written. The next session starts with stale context. This
has happened to me quite a few times and it causes me to have to repeat myself to bring us collectively back into context. I added safeguards, but they're text in a text file - more instructions the model may choose to ignore. The fix has the same weakness as the thing it's fixing.

**Lack of verification lessens confidence.** I can't tell you with high confidence whether last week's hygiene audit was correct. I can't measure whether context loading worked as intended. I trust the output because it usually looks right. "Usually looks right" is not a confidence level I'd accept in any other system I operate so it's made me question the maturity of Argus.

**Context gets heavier and noisier over time.** Every time I teach Argus something new by ingesting a new source of information the system gets heavier. The routing table grows. The session history grows. The knowledge base grows. All of this competes for the model's attention inside a finite context window, and there's nothing particularly smart about how it gets loaded - it's a flat file read every time. This base context loads with every single conversation and it keeps growing, with no awareness of whether it is relevant to what I'm actually doing in the present. Six months from now, this will be meaningfully worse than it is today, and currently I have no strategy for managing it.

**Things don't work without me in the driver's seat.** Argus lives in a single Cursor workspace. If I switch to a different project in a different window, Argus isn't there - all the knowledge, memory, and skills stay behind. I ran into this while editing this very blog post in a separate workspace. My command center doesn't travel with me.

It also can't do anything on its own. If I want a hygiene scan at 6am with results waiting when I sit down, that's not possible. If I want it to notice a Jira event and react, it can't. It sits completely inert until I'm in the seat typing. That's fine for a chat assistant. It's limiting for something I want to depend on.

---

## Reliability lives in the harness

The agent engineering space in 2026 settled some debates that were open when I wrote [my initial post](/posts/harness-vs-framework-agents/).

The core insight: **a harness is the system that turns a model into a reliable agent.** The model provides intelligence. The harness provides the mechanics - tool execution, memory, safety boundaries, and verification. The model picks the next action. The harness validates it, executes it, captures the output, decides what to feed back, decides when to stop. Swap the model for a
different one of similar quality and a good harness still works. Swap the harness for a worse one and the best model in the world still produces unreliable results.

![Model vs Harness responsibilities](/images/model-vs-harness.png)

Cursor is my current harness for Argus. It provides file access, tool execution, conversation memory, and skill discovery. But it's a general-purpose harness. It doesn't know about my domain. My domain-specific reliability needs, like enforcing that the routing table gets checked, that session state gets persisted, that provenance is recorded, are all delegated to the LLM through conventions. That makes things non-deterministic, and worse, invisible. Cursor manages the interaction between my instructions and the model internally. I don't see what context was loaded, which files were read, or whether the model followed the routing table or just answered from memory. If I ask the model, it doesn't know either. The infrastructure work is being done by instructions provided in Markdown instead of code. That's the gap I need to close.

## Argus v2 design inputs

Some of the early bets landed well and carry forward. What I hadn't accounted for is the infrastructure underneath. The good news is the industry has converged on patterns for the gaps I'm seeing: [evals as a regression safety net](https://machinelearningatscale.substack.com/p/anthropic-shipped-three-regressions), [durable state that survives session boundaries](https://developers.googleblog.com/en/build-long-running-ai-agents-that-pause-resume-and-never-lose-context-with-adk/), and [a standard protocol for agent-to-tool integration](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation).

![Design inputs: keeping and adding](/images/design-inputs.png)

---

## Where this is going

Argus is becoming a service. A small Python application with structured
storage, an MCP interface, and the ability to act without me sitting in
front of it.

The architecture splits into two layers:

**The markdown layer** (agent-facing, stays in Cursor): skills that
describe workflows, knowledge files that encode domain expertise,
memory entries that a human can read and edit. This is where intent
lives. Legible, editable, shareable.

**The code layer** (system reliability): context assembly that's typed
and deterministic, rule evaluation that's pure logic without LLM
judgment, state management that's durable and queryable, provenance
enforcement that's schema validation, and an eval suite that proves
correctness.

The dashboard I already have evolves from "view my Jira health data"
into "see what Argus did, trigger what Argus should do." The command
center gets an actual interface, not just a chat window.

Cursor stays as the hands-on-keyboard mode for interactive work. The
service handles everything that should be deterministic, persistent, or
autonomous. MCP connects the two.

---

## How I'm building it

Not all at once. Incremental, validated at each step.

**First: the eval harness.** Define what "correct" looks like for the
system's current behavior. Fifty scenarios. A test runner. Tracing on
every operation. Before I change anything, I want data on how well the
current system actually works. Intuition says "pretty well." I want
numbers.

**Second: structured memory.** Replace append-only markdown with
queryable storage. Every session, every decision, every priority change
gets a typed record. The eval suite proves retrieval works. The old
files become migration input, not the ongoing format.

**Third: deterministic workflows.** The things that don't need an LLM.
Hygiene rule evaluation is logic, not judgment. Priority scoring is
math. Context assembly is a graph traversal. Move these into code. The
eval suite proves they produce the same results as the current system,
then better results.

**Fourth: the autonomous capability.** An LLM gateway for tasks that
should run without me. A scheduler for the things that should happen on
a cadence. The dashboard as the approval surface. Only after the
foundation is proven.

Each step gets validated by evals before the next one starts. No
guessing whether it's better. Measurement.

---

## The target

Under 5,000 lines of core code. Python. SQLite. Typed with Pydantic.
Tested. A system one person can hold in their head and maintain over
time. Skills remain markdown. Knowledge remains markdown. The
reliability infrastructure underneath becomes real software.

The goal isn't to build a platform. It's to build a personal tool that
works with the same reliability I expect from any other system I depend
on. The model contributes intelligence. The harness contributes
everything else.

---

## Why write this up

Partly to force my own thinking into coherent form. Partly because I
keep running into people building similar systems and hitting similar
walls. There's plenty written about getting started with AI productivity
setups. Not much about what happens after you've been running the thing
for a while and the shine wears off.

What happens is: the conventions start to creak. The lack of
verification starts to matter. The inability to act autonomously starts
to feel like a ceiling. The system that was magic in month one is merely
good in month six, and you start wanting guarantees instead of hopes.

If you're in that spot, the pattern seems to be: keep the markdown layer
(it's genuinely the right interface for communicating intent to agents),
but build real infrastructure underneath it. Evals first. Structured
state second. Deterministic execution where the LLM isn't needed.
Autonomous capability last.

The primitives that compound: context engineering, tool design, eval
discipline, the harness mindset. The things that don't compound: this
week's framework, this month's model, surface-level familiarity with
whatever just launched.

Build the boring parts well. The rest follows.
