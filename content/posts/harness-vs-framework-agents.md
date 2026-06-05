---
title: "I Built a Multi-Agent System Inside Cursor. Here's Why I Tore It Down."
date: 2025-11-15
tags: ["ai", "agents", "cursor", "architecture"]
description: "The vision of specialized AI agents is real and powerful. But the implementation has to match the runtime."
---

I spent about a month building an AI command center for engineering management. I call it Argus. The idea was specialized AI agents with deep domain knowledge, orchestrated by a Manager agent that routes requests to the right specialist. An Agile Practitioner for Jira work. A Prompt Engineer for crafting prompts. A Rewards Advisor for performance reviews. Each designed with care, each with a portable system prompt I could paste into any LLM.

It was a clean architecture. It also turned out to be the wrong one.

---

## The vision

I wanted something beyond "chat with an LLM." When I asked about sprint health, I wanted an expert Agile Practitioner that would push back on anti-patterns and flag risks I hadn't considered. When I needed to draft Quarterly Connection (performance review) feedback, I wanted a Rewards Advisor that understood performance review conventions and my team's context.

My plan was to build specialized agents, each with a unique persona that shapes how the LLM reasons about problems in that domain. A Manager agent would sit on top, recognize what kind of work I'm doing, and delegate to the right specialist. The specialist hands back to the Manager when the task crosses domain boundaries.

I've read about CrewAI, AutoGen, the OpenAI Agents SDK. The pattern made sense to me. Agents with scoped tools, isolated contexts, real handoffs. I built toward that.

---

## What actually happened

I stood up Argus, and used it quite happily. It worked! Three weeks in, I became a little suspicious. I'd ask the model questions about the flow of information and responses I'd recieved and what was returned to me was vague - until the model flat out said it wasn't sure. It led me to create and run `/argus.trace`, a diagnostic command I'd built to show which agents actually handled a given task. The results were brutal.

Every single task (Jira hygiene audits, backlog grooming, performance data extraction, sprint planning) had been handled by the core LLM. Not one specialist agent had been engaged. My carefully crafted personas were sitting unused in the `agents/` folder.

![The trace results were brutal](/images/argus-trace-reveal.png)

My architecture diagram showed a sophisticated routing system. The reality was a Cursor rule file and some skills that fired when I said the right words. My "Manager agent" was a markdown table that pointed to knowledge files. My "Agile Practitioner" was a system prompt that only loaded when I manually ran a slash command, which I almost never did because the skills already did the job.

---

## The distinction that matters: harness vs. framework

Here's what I missed.

**Framework agents** live in systems like CrewAI, AutoGen, and the OpenAI Agents SDK. In those environments, you build the orchestration. Each agent is a separate execution context with its own system prompt, its own tool access, its own memory. When Agent A hands off to Agent B, context is serialized and the new agent starts fresh with scoped tools and a clear mandate. You control the runtime.

**Harness agents** live inside AI-powered IDEs like Cursor, Windsurf, or Claude Code. The IDE _is_ the runtime. It already handles tool access (MCP servers, browser, shell), context management (rules, skills, knowledge files), and workflow routing (skill auto-discovery matches your request to the right workflow). Building a framework-style orchestration layer on top of what the platform already provides is like building a web framework inside Django.

![Framework vs Harness](/images/harness-vs-framework.png)

---

## Why my personas didn't work the way I expected

In a **framework**, a persona constrains an agent's behavior in meaningful ways. My Agile Practitioner would only get Jira tools. It couldn't accidentally touch Workday or another sensitive system. Its context would be isolated. The persona in this case creates true specialization through restriction.

Cursor is my **harness**. There's one conversation with one LLM. "Loading an agent" in this world means reading a system prompt into the shared context window. The LLM doesn't become a different entity, it reads more instructions and tries to follow them all. Tool access can't be enforced per persona, so my Agile Practitioner has access to everything the Prompt Engineer does. Context isn't isolated either. The LLM remembers the entire conversation regardless of which "agent" is active.

I had 200+ lines of persona instructions for my Agile Practitioner persona. The skills I'd created already contained the guardrails that mattered for me, to confirm before acting, push back on anti-patterns, and never invent data. Those fired automatically when I said "run a hygiene audit." The persona would have added tone and framing on top of that, but I would have to manually activate it with a slash command. I never did that because it felt unnecessary.

So the skills did the work. The persona sat on the shelf.

---

## What was actually valuable

Tearing down the multi-agent architecture didn't mean starting over. It meant honestly naming what was working.

**Knowledge routing.** A simple table in an always-on Cursor rule that maps question types to knowledge files. "What does Release Pending mean?" goes to `fields-reference.md`. "When is code freeze?" goes to `release-schedule.md`. No agent needed. Just a lookup table the LLM checks before answering.

**Skills with embedded guardrails.** Workflow files that auto-activate via Cursor's platform when my request matches. Each carries its own behavioral preamble containing the most valuable parts of what used to be persona instructions, delivered without any manual activation.

**Structured domain knowledge.** Twenty-five hygiene rules, prioritization frameworks, release schedules, delivery level requirements, and field ID mappings, all in Markdown files organized by domain. This is the real depth that makes my system better than a generic LLM.

**Session continuity.** An append-only session log, a priority list that persists across conversations, project memory files that record where work stopped. Every session picks up where the last one left off.

**Source provenance.** Every piece of domain knowledge traces back to a source document with a date. When rules conflict (and they did, I tracked nine conflicts across twenty-one sources), both positions are documented until resolved. This is what makes the knowledge trustworthy.

None of these required the multi-agent model.

---

## What I learned

**Understand your runtime before designing your architecture.** If you're building inside Cursor, Windsurf, or a similar AI harness, the platform already provides tool access, context management, and workflow routing. My job was to give it good knowledge and well-structured skills, not to rebuild orchestration on top of orchestration.

**Skills beat personas for most work.** A skill with embedded behavioral guardrails fires automatically, carries the constraints that matter, and requires zero activation friction. A persona adds depth for long sessions, but if you find yourself avoiding the activation step, the persona isn't earning its keep.

**Knowledge is the real differentiator.** A generic LLM knows about Jira. It doesn't know my team's 25 hygiene rules, our Fix Version vs. Target Version policy, or that disconnected testing is required at Tech Preview but deferrable via exception. That structured domain knowledge is what makes the system meaningfully better than a general-purpose chatbot.

**Session continuity is worth investing in.** Most AI tools assume every conversation starts from zero. If you can solve "where did I leave off?" you've built something genuinely useful. This doesn't require agents. It requires a memory convention and the discipline to maintain it.

**Name things honestly.** I called my Cursor rule a "Manager agent" and my skill files "agent capabilities." They weren't agents. They were a routing table and workflow files. The honest names (rule, skill, knowledge) are less exciting but more useful. They tell you exactly what the thing does and how to improve it.

---

## Where I landed

Building Argus as a multi-agent system taught me what multi-agent systems are actually for, and what they're not. The vision of specialized AI that reasons differently about different domains is real. But the implementation has to match the runtime. Inside an AI coding assistant, the right architecture isn't agents orchestrating agents. It's deep knowledge, well-structured skills, and a platform that's already good at routing.

My system now is simpler, has no activation friction, and produces the same quality output. The things that made it special (session continuity, knowledge provenance, domain depth) were never about agents in the first place.

Sometimes the most important architecture decision is recognizing when you're solving the wrong problem.
