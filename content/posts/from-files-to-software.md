---
title: "My AI Command Center Outgrew Its Approach"
date: 2026-05-23
tags: ["ai", "agents", "architecture", "harness-engineering"]
description: "What happens after you've been running an AI productivity system for a while and you realize there's more to gain."
---

Six months ago I wrote about tearing down a multi-agent system I'd built inside Cursor. The agents I'd built were "fake" - that's to say they weren't called and utilized as a part of my workflows as I'd expected. The skills and knowledge underneath the agents, were very muchreal. I kept those, deleted the rest, and ended up with something simpler that produced the same quality output.

I've been running this simpler system for months. It's almost entirely driven through markdown files. It works. It's works quite well actually. But the system also has needs that I can't fix by simply writing better markdown.

---

## Here's what I built

Argus is my personal engineering management command center. I use it every day for productivity at work. It runs inside Cursor as a collection of skills, knowledge files, and conventions. When I say for example, "run a hygiene audit," Cursor's skill discovery activates a workflow file that checks my team's Jira board against 25 rules. When I ask "when is code freeze?", a routing table in an always-on rule points to the knowledge file referencing our product release schedule and the answer comes back.

Session continuity carries context between conversations. An append-only log records what happened in each session. A priority list persists what I should be working on. Project memory files track where long-running work left off. Every session starts by reading the last one's notes.

I've build in "source provenance" which means every piece of domain knowledge traces back to a
specific document with a date and an ID. When sources conflict, both positions are recorded until I resolve them.

The whole thing is markdown files and conventions. No code. No database. No service. Just structured text that the LLM reads and follows.

---

## The cracks in the design

Up until now, I haven't experienced any dramatic problems. The system doesn't break in many obvious ways. But, the potential for Argus to degrade quietly is what bothers me, which might be much worse.

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

## What I learned from looking around

The agent engineering space in 2026 settled some debates that were open when I wrote [my initial post](/posts/harness-vs-framework-agents/).

The core insight: **a harness is the system that turns a model into a reliable agent.** The model provides intelligence. The harness provides the mechanics - tool execution, memory, safety boundaries, and verification. The model picks the next action. The harness validates it, executes it, captures the output, decides what to feed back, decides when to stop. Swap the model for a
different one of similar quality and a good harness still works. Swap the harness for a worse one and the best model in the world still produces unreliable results.

![Model vs Harness responsibilities](/images/model-vs-harness.png)

My current system has skills and knowledge (the intelligence input) but almost no harness (the reliability infrastructure). The LLM is the harness. That's the gap.

Some specific things that stuck:

**MCP became the standard integration protocol.** It's not a contender
anymore, it's the default. Every major model provider backs it. The
Linux Foundation stewards it. The mental model is clean: tools for
actions, resources for data, prompts for reusable instructions. An agent
connects to a server and discovers capabilities at runtime. For anything
managing multiple integrations, MCP reduces the wiring problem from
quadratic to linear.

**Persistent memory got real solutions.** Google's ADK introduced
checkpoint-and-resume with durable state machines. The research
community published papers on structured memory that compresses old
context into high-signal representations instead of dumping raw history.
The common thread: the fix isn't a bigger context window. It's explicit,
durable state decoupled from conversation history.

**Evals became non-negotiable.** Every team shipping reliable agents has
a regression suite. Every team that doesn't ship regressions. One
industry-leading agent shipped a 47% performance regression and only
caught it because users complained. If they can't catch it with their
resources, I'm definitely not catching mine with "it usually looks
right."

**Skills are interface. Code is infrastructure.** Someone put it well:
skills make your working style legible for agents. They don't replace
the actual system underneath. The markdown tells the agent what to do.
The code makes sure it does it reliably. Neither replaces the other.

---

## What stays the same

The things that made Argus worth building haven't changed. They're
moving from conventions into guarantees.

**Provenance stays.** Every piece of knowledge still traces to a source.
But in the new system, you can't add knowledge without a source record.
The system refuses, not requests. Provenance becomes a schema constraint
instead of a polite instruction.

**Memory stays.** Session continuity is still what makes the whole thing
worth using over a bare LLM. What changes is the format underneath:
structured storage with retrieval intelligence instead of append-only
text. Queryable. Compressible. Durable regardless of how the
conversation ends.

**Context-is-the-product stays.** The system still loads the right
context before you ask. But instead of a routing table the model might
or might not check, a dependency graph makes the decision
deterministically. Same behavior, actual guarantee.

**Skills stay as markdown.** The workflows that encode how I manage
sprints, audit boards, and review backlogs. Human-editable.
Version-controlled. They remain the interface layer. What changes is
what happens when they execute.

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
