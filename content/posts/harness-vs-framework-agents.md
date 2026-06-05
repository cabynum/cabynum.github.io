---
title: "I Built a Multi-Agent System Inside Cursor. Here's Why I Tore It Down."
date: 2025-11-15
tags: ["ai", "agents", "cursor", "architecture"]
description: "The vision of specialized AI agents is real and powerful. But the implementation has to match the runtime."
---

I spent about a month building an AI command center for engineering management. I call it Argus. The idea was specialized AI agents with deep domain knowledge, orchestrated by a Manager agent that routes requests to the right specialist. An Agile Practitioner for Jira work. A Prompt Engineer for crafting prompts. A Rewards Advisor for performance reviews. Each designed with care, each with a portable system prompt I could paste into any LLM.

It was a clean architecture. It also turned out to be the wrong one.

---

## My Grande Plan

I wanted something beyond "chat with an LLM." When I asked about sprint health, I wanted an expert Agile Practitioner that would push back on anti-patterns and flag risks I hadn't considered. When I needed to draft Quarterly Connection (performance review) feedback, I wanted a Rewards Advisor that understood performance review conventions and my team's context.

My plan was to build specialized agents, each with a unique persona that shapes how the LLM reasons about problems in that domain. A Manager agent would sit on top, recognize what kind of work I'm doing, and delegate to the right specialist. The specialist hands back to the Manager when the task crosses domain boundaries.

I've read about CrewAI, AutoGen, the OpenAI Agents SDK. The pattern made sense to me. Agents with scoped tools, isolated contexts, real handoffs. I built toward that.

![The Plan](/images/the-vision-architecture.png)

---

## Argus v1

I stood up Argus, and used it quite happily. It worked! Three weeks in, I became a little suspicious. I'd ask the model questions about the flow of information and responses I'd received and what was returned to me was consistently vague, until the model flat out said "I'm not sure." It led me to create and run `/argus.trace`, a diagnostic command I'd built to show which agents actually handled a given task. The results were brutal.

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

## Argus v2 - Reducing to value

Tearing down the Argus v1 didn't mean starting over entirely. It meant taking a honest look at what was working, capturing those capabilities, and ditching the rest to establish Argus v2.

What was worth keeping...

![What Survived](/images/what-survived-building-blocks.png)

### Knowledge routing

This was implemented as a simple table in an always-on Cursor rule that maps question types to knowledge files. "What does Release Pending mean?" maps to `fields-reference.md`. "When is code freeze?" maps to `release-schedule.md`. No agent needed. Just a lookup table the LLM checks before answering.

### Skills with embedded guardrails

Skills auto-activate by default in Cursor when my request matches their description. "Run a hygiene audit" fires the hygiene-audit skill, which references a set of scoring rules and knows how to grade each issue. "Plan my sprint" triggers sprint-planning, which knows my team's velocity history and the specific allocation targets (ratios of new feature work to tech debt etc.) for my team's work. Each skill embeds the domain logic it needs to do its job.

### Structured domain knowledge

I added structured domain knowledge to Argus in Markdown files organized by area of focus. This domain knowledge covers everything from Jira hygiene rules to release schedules, to organization strategy. A generic LLM knows generally about Jira. Argus knows that disconnected testing is required at Tech Preview, and that Fix Version means committed while Target Version means targeted. This specificity is what makes the system useful.

### Session continuity

Session continuity was one of the first things I invested in, and it might be the most important. When chatting with LLMs, every conversation starts from zero unless you do something about it. I built `/argus.start` and `/argus.end` commands around an append-only session log, a live priority list, and per-project memory files. When I open a session, Argus reads the last entry and tells me what I was doing and what to pick up next.

This maps to what the industry is calling [agent memory](https://www.linkedin.com/pulse/agent-memory-angie-jones-odrjc/) - conversational, semantic, episodic, procedural. My session logs are episodic memory. My knowledge files are semantic memory. My project files are entity memory. I just built it for myself in Markdown before learning of this terminology.

The next evolution is dropping the ceremony entirely. What I actually want is a system that always knows and maintains persistent awareness across every session.

### Source provenance

Every piece of domain knowledge in Argus traces back to a registered source with an ID and a date. I've ingested information sources detailing Jira admin documentation, product strategy decks, release engineering runbooks and more. When rules from different sources conflict, and as you can imagine this happens many times in a large engineering organization, both positions are documented until I resolve them. This is what makes the knowledge trustworthy.

The key takeaway here is, none of these capabilities requires the multi-agent model.

---

## The Learnings

**Understand your runtime before designing your architecture.**

If you're building inside Cursor, Windsurf, or a similar AI harness, the platform already provides tool access, context management, and workflow routing. Understanding what the platform handles tells you where to invest your effort, and where the platform's coverage ends and you need to build your own reliability.

**Skills beat personas for most work.**

A skill with embedded behavioral guardrails fires automatically, carries the constraints that matter, and requires zero activation friction. A persona adds depth for long sessions, but if you find yourself avoiding the activation step, the persona isn't earning its keep.

**Knowledge is the real differentiator.**

A generic LLM doesn't know the specifics of my world. It doesn't know my team's Jira expectations, our Fix Version vs. Target Version policy, or that disconnected testing is required at Tech Preview but deferrable via exception. That structured domain knowledge is what makes Argus meaningfully better than a general-purpose chatbot.

**Session continuity is worth investing in.**

Most AI tools assume every conversation starts from zero. If you can solve "where did I leave off?" you've built something genuinely useful. I started with memory conventions and manual commands. They work, but they depend on discipline. If I forget to end a session the context goes stale. The convention was the right starting point but whether it's the right long-term solution is a different question.

**Learn how your harness works.**

I built agents without fully understanding the building blocks underneath. Cursor has rules (always-on context), skills (workflows that activate when your request matches), and the files those skills reference, which Cursor doesn't even have a formal name for. I didn't understand these distinctions when I started. That's why I ended up building personas that duplicated what skills already did, and a "Manager agent" that was really just a rule. The better I understood the harness, the less I needed to build on top of it.

---

## The Takeaway

Building Argus as a multi-agent system taught me what multi-agent systems are actually for, and what they're not. The vision of specialized AI that reasons differently about different domains is real. But the implementation has to match the runtime. Inside an AI coding assistant, I didn't find agents orchestrating agents to be the right architecture. I'd love to hear about others' success or failure stories there. I found that deep knowledge, well-structured skills, and a platform that's already good at routing is a powerful combo that addresses most cases.

My system now is simpler, has no activation friction, and produces the same quality output. The things that made it special (session continuity, knowledge provenance, domain depth) were never about agents in the first place.

Sometimes the most important architecture decision is recognizing when you're solving the wrong problem. That doesn't mean the work stops. Argus v2 is better than v1, and there's already a v3 forming in my head. Pivoting when things are off is almost always the right call.
