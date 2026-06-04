---
title: "I Built a Multi-Agent System Inside Cursor. Here's Why I Tore It Down."
date: 2025-11-15
tags: ["ai", "agents", "cursor", "architecture"]
description: "The vision of specialized AI agents is real and powerful. But the implementation has to match the runtime."
---

I spent about a month building an AI command center for engineering management. I called it Argus. The idea was specialized AI agents with deep domain knowledge, orchestrated by a Manager agent that routes requests to the right specialist. An Agile Practitioner for Jira work. A Prompt Engineer for crafting prompts. A Rewards Advisor for performance reviews. Each designed with care, each with a portable system prompt I could paste into any LLM.

It was a clean architecture. It also turned out to be the wrong one.

---

## The vision

I wanted something beyond "chat with an LLM." When I asked about sprint health, I wanted an expert Agile Practitioner that would push back on anti-patterns and flag risks I hadn't considered. When I needed to draft QC feedback, I wanted a Rewards Advisor that understood performance review conventions and my team's context.

My plan: build specialized agents, each with a persona that shapes how the LLM reasons about problems in that domain. A Manager agent sits on top, recognizes what kind of work I'm doing, and delegates to the right specialist. The specialist hands back to the Manager when the task crosses domain boundaries.

I'd read about CrewAI, AutoGen, the OpenAI Agents SDK. The pattern made sense. Agents with scoped tools, isolated contexts, real handoffs. I built toward that.

---

## What actually happened

Three weeks in, I ran `/argus.trace`, a diagnostic command I'd built to show which agents actually handled a given task. The results were brutal.

Every single task - Jira hygiene audits, backlog grooming, Workday data extraction, sprint planning - had been handled by the core LLM. Not one specialist agent had been engaged. My carefully crafted personas were sitting unused in the `agents/` folder.

![The trace results were brutal](/images/argus-trace-reveal.png)

My architecture diagram showed a sophisticated routing system. The reality was a Cursor rule file and some skills that fired when I said the right words. My "Manager agent" was a markdown table that pointed to knowledge files. My "Agile Practitioner" was a system prompt that only loaded when I manually ran a slash command, which I almost never did because the skills already did the job.

---

## The distinction that matters: harness vs. framework

Here's what I missed.

**Framework agents** live in systems like CrewAI, AutoGen, and the OpenAI Agents SDK. In those environments, you build the orchestration. Each agent is a separate execution context with its own system prompt, its own tool access, its own memory. When Agent A hands off to Agent B, it's a real handoff - context is serialized, the new agent starts fresh with scoped tools and a clear mandate. You control the runtime.

**Harness agents** live inside AI-powered IDEs like Cursor, Windsurf, or Claude Code. The IDE _is_ the runtime. It already handles tool access (MCP servers, browser, shell), context management (rules, skills, knowledge files), and workflow routing (skill auto-discovery matches your request to the right workflow). Building a framework-style orchestration layer on top of what the platform already provides is like building a web framework inside Django.

![Framework vs Harness](/images/harness-vs-framework.png)

I was building framework agents inside a harness. That was my fundamental mistake.

---

## Why personas didn't work the way I expected

In a framework, a persona constrains an agent's behavior in meaningful ways. My Agile Practitioner would only get Jira tools. It couldn't accidentally touch Workday. Its context would be isolated. The persona creates genuine specialization through restriction.

In Cursor, there's one conversation with one LLM. "Loading an agent" means reading a system prompt into the shared context window. The LLM doesn't become a different entity. It reads more instructions and tries to follow them all. Tool access can't be scoped - my Agile Practitioner has access to everything the Prompt Engineer does. Context isn't isolated - the LLM remembers the entire conversation regardless of which "agent" is active.

I had 290 lines of persona instructions for the Agile Practitioner. But my skills that fired when I said "run a hygiene audit" already contained the behavioral guardrails that mattered: confirm before acting, push back on anti-patterns, never invent data. The persona was layering tone and framing on top, but only if I explicitly activated it via slash command. I naturally avoided that because it was friction.

The skills carried most of the value. The persona added a layer that was gated behind an activation step I didn't want to take.

---

## What was actually valuable

Tearing down the multi-agent architecture didn't mean starting over. It meant honestly naming what was working.

**Knowledge routing.** A simple table in an always-on Cursor rule that maps question types to knowledge files. "What does Release Pending mean?" goes to `fields-reference.md`. "When is code freeze?" goes to `release-schedule.md`. No agent needed. Just a lookup table the LLM checks before answering.

**Skills with embedded guardrails.** Workflow files that auto-activate via Cursor's platform when my request matches. Each carries its own behavioral preamble - the most valuable parts of what used to be persona instructions, delivered without any manual activation.

**Structured domain knowledge.** Twenty-five hygiene rules, prioritization frameworks, release schedules, delivery level requirements, field ID mappings - all in Markdown files organized by domain. This is the real depth that makes my system better than a generic LLM.

**Session continuity.** An append-only session log, a priority list that persists across conversations, project memory files that record where work stopped. Every session picks up where the last one left off.

**Source provenance.** Every piece of domain knowledge traces back to a source document with a date. When rules conflict (and they did - I tracked nine conflicts across twenty-one sources), both positions are documented until resolved. This is what makes the knowledge trustworthy.

None of these required the multi-agent model.

---

## What I learned

**Understand your runtime before designing your architecture.** If you're building inside Cursor, Windsurf, or a similar AI harness, the platform already provides tool access, context management, and workflow routing. My job was to give it good knowledge and well-structured skills, not to rebuild orchestration on top of orchestration.

**Skills beat personas for most work.** A skill with embedded behavioral guardrails fires automatically, carries the constraints that matter, and requires zero activation friction. A persona adds depth for long sessions, but if you find yourself avoiding the activation step, the persona isn't earning its keep.

**Knowledge is the real differentiator.** A generic LLM knows about Jira. It doesn't know my team's 25 hygiene rules, our Fix Version vs. Target Version policy, or that disconnected testing is required at Tech Preview but deferrable via exception. That structured domain knowledge is what makes the system meaningfully better than a general-purpose chatbot.

**Session continuity is worth investing in.** Most AI tools assume every conversation starts from zero. If you can solve "where did I leave off?" you've built something genuinely useful. This doesn't require agents. It requires a memory convention and the discipline to maintain it.

**Name things honestly.** I called my Cursor rule a "Manager agent" and my skill files "agent capabilities." They weren't agents. They were a routing table and workflow files. The honest names - rule, skill, knowledge - are less exciting but more useful. They tell you exactly what the thing does and how to improve it.

---

## Where I landed

Building Argus as a multi-agent system taught me what multi-agent systems are actually for, and what they're not. The vision of specialized AI that reasons differently about different domains is real. But the implementation has to match the runtime. Inside an AI coding assistant, the right architecture isn't agents orchestrating agents. It's deep knowledge, well-structured skills, and a platform that's already good at routing.

My system now is simpler, has no activation friction, and produces the same quality output. The things that made it special - session continuity, knowledge provenance, domain depth - were never about agents in the first place.

Sometimes the most important architecture decision is recognizing when you're solving the wrong problem.
