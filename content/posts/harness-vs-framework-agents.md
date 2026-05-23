---
title: "I Built a Multi-Agent System Inside Cursor - Here's Why I Tore It Down"
date: 2025-11-15
tags: ["ai", "agents", "cursor", "architecture"]
description: "The vision of specialized AI agents is real and powerful. But the implementation has to match the runtime."
---

I spent a month building an AI command center for engineering management.
I called it Argus. The vision: specialized AI agents with deep domain
knowledge, orchestrated by a Manager agent that routes requests to the
right specialist. An Agile Practitioner for Jira work. A Prompt Engineer
for crafting prompts. A Rewards Advisor for performance reviews. Each
designed with care, each with a portable system prompt you could paste
into any LLM.

It was a clean, compelling architecture. It was also the wrong one.

---

## The Vision

I wanted something beyond "chat with an LLM." When I asked about sprint
health, I wanted an expert Agile Practitioner pushing back on anti-patterns
and flagging risks I hadn't considered. When I needed to draft QC feedback,
I wanted a Rewards Advisor that understood performance review conventions
and my team's context. The generic LLM wouldn't cut it.

The plan: build specialized agents, each with a persona that shapes how
the LLM reasons about problems in that domain. A Manager agent sits on top,
recognizes what kind of work you're doing, and delegates to the right
specialist. The specialist hands back to the Manager when the task crosses
domain boundaries. Textbook multi-agent orchestration.

I'd read about CrewAI, AutoGen, the OpenAI Agents SDK. The pattern made
sense. Agents with scoped tools, isolated contexts, real handoffs. I built
toward that.

---

## What Actually Happened

Three weeks in, I ran `/argus.trace` - a diagnostic command I'd built to
show which agents actually handled a given task. The results were brutal.

Every single task - Jira hygiene audits, backlog grooming, Workday data
extraction, sprint planning - had been handled by the core LLM. Not a
single specialist agent had been engaged. The carefully crafted personas
were sitting unused in the `agents/` folder.

The architecture diagram showed a sophisticated routing system. The reality
was a Cursor rule file and some skills that auto-fired when I said the
right words. The "Manager agent" was a markdown table that pointed to
knowledge files. The "Agile Practitioner" was a system prompt that only
loaded when I manually ran a slash command - which I almost never did,
because the skills already did the job.

---

## The Distinction That Matters: Harness vs. Framework

Here's what I missed, and what I think anyone building with AI coding
assistants needs to understand.

**Framework agents** live in systems like CrewAI, AutoGen, and the OpenAI
Agents SDK. In these environments, you build the orchestration. Each agent
is a separate execution context with its own system prompt, its own tool
access, its own memory. When Agent A hands off to Agent B, it's a real
handoff - context is serialized, the new agent starts fresh with scoped
tools and a clear mandate. You control the runtime.

**Harness agents** live inside AI-powered IDEs like Cursor, Windsurf, or
Claude Code. The IDE *is* the runtime. It already handles tool access
(MCP servers, browser, shell). It already handles context management
(rules, skills, knowledge files). It already handles workflow routing
(skill auto-discovery matches your request to the right workflow). Building
a framework-style agent orchestration layer on top of what the platform
already provides is like building a web framework inside Django.

I was building framework agents inside a harness. That's the fundamental
mismatch.

---

## Why Personas Didn't Add What I Expected

In a framework, a persona constrains an agent's behavior in meaningful
ways. The Agile Practitioner only gets Jira tools. It can't accidentally
touch Workday. Its context is isolated - it doesn't know about prompt
engineering or performance reviews. The persona creates genuine
specialization through restriction.

In Cursor, there's one conversation with one LLM. "Loading an agent"
means reading a system prompt into the shared context window. The LLM
doesn't become a different entity. It reads more instructions and tries
to follow them all. Tool access can't be scoped - the Agile Practitioner
has access to everything the Prompt Engineer does. Context isn't isolated
- the LLM remembers the entire conversation regardless of which "agent"
is active.

I had 290 lines of persona instructions for the Agile Practitioner. But
the skills that auto-fired when I said "run a hygiene audit" already
contained the behavioral guardrails that mattered: confirm before acting,
push back on anti-patterns, never invent data. The persona was adding
sustained tone and framing on top, but only if I explicitly activated it
via slash command - which I naturally avoided because it was friction.

The 80/20 was clear: skills carried 80% of the value. The persona
added 20% that was gated behind an activation step I didn't want to take.

---

## What Was Actually Valuable

Tearing down the multi-agent architecture didn't mean starting over. It
meant honestly naming what was working.

**Knowledge routing.** A simple table in an always-on Cursor rule that
maps question types to knowledge files. "What does Release Pending mean?"
goes to `fields-reference.md`. "When is 3.5 Code Freeze?" goes to
`release-schedule.md`. No agent needed. Just a lookup table.

**Skills with embedded guardrails.** Seven workflow files that auto-activate
via Cursor's platform when the request matches. Each carries its own
behavioral preamble - the most valuable parts of what used to be persona
instructions, delivered without any manual activation.

**Structured domain knowledge.** Twenty-five hygiene rules, lane-based
prioritization frameworks, release schedules, delivery level requirements,
field ID mappings - all in markdown files organized by domain. This is the
real depth that makes the system better than a generic LLM.

**Session continuity.** An append-only session log, a priority list that
persists across conversations, project memory files that record where work
stopped. Every session picks up where the last one left off. No other
system I've seen does this well.

**Source provenance.** Every piece of domain knowledge traces back to a
source document with a date. When rules conflict (and they did - I tracked
nine conflicts across twenty-one sources), both positions are documented
until resolved. This is what makes the knowledge trustworthy.

None of these required the multi-agent model. They stood on their own.

---

## What I'd Tell Someone Starting Today

**Understand your runtime before designing your architecture.** If you're
building inside Cursor, Windsurf, or a similar AI harness, the platform
already provides tool access, context management, and workflow routing.
Your job is to give it good knowledge and well-structured skills -
not to rebuild orchestration on top of orchestration.

**Skills beat personas for most work.** A skill with embedded behavioral
guardrails fires automatically, carries the constraints that matter, and
requires zero activation friction. A persona adds sustained behavioral
depth for long sessions, but if you find yourself avoiding the activation
step, the persona isn't earning its keep.

**Knowledge is the real moat.** The generic LLM knows about Jira. It
doesn't know your team's 25 hygiene rules, your org's Fix Version vs.
Target Version policy, or that disconnected testing is required at Tech
Preview but deferrable via exception. That structured domain knowledge is
what makes the system meaningfully better than ChatGPT.

**Session continuity is an unsolved problem worth solving.** Most AI
tools assume every conversation starts from zero. If you can solve
"where did I leave off?" you've built something genuinely novel. This
doesn't require agents - it requires a memory convention and the
discipline to use it.

**Name things honestly.** I called my Cursor rule a "Manager agent" and
my skill files "agent capabilities." They weren't agents. They were a
routing table and workflow files. The honest names - rule, skill,
knowledge - are less exciting but more useful. They tell you exactly what
the thing does and how to improve it.

---

## The Takeaway

Building Argus as a multi-agent system taught me what multi-agent systems
are actually for - and what they're not. The vision of specialized AI
that reasons differently about different domains is real and powerful. But
the implementation has to match the runtime. Inside an AI coding assistant,
the right architecture isn't agents orchestrating agents. It's deep
knowledge, well-structured skills, and a platform that's already good at
routing.

The system I have now is simpler, has no activation friction, and produces
the same quality output. The things that made it special - session
continuity, knowledge provenance, domain depth - were never about agents
in the first place.

Sometimes the most important architecture decision is recognizing when
you're solving the wrong problem.
