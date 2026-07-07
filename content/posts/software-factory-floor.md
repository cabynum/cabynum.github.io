---
title: "What's on our Factory Floor"
date: 2026-07-07T00:00:00-04:00
draft: false
tags: ["ai", "software-factory", "agentic-sdlc", "engineering-leadership"]
description: "The Software Factory isn't one pipeline. It's a set of specialized workstations wired into a shared switchboard. Here's what's actually on the floor."
---

In my [last post](/posts/what-is-a-software-factory/), I described what a Software Factory is and why my organization is building one. I kept the view as accessible as I could, framing it as a pipeline of agents with quality gates and human checkpoints at each stage.

That's a useful mental model for understanding the concept. But now that we're looking at what's actually in place, the picture gets more interesting.

---

## The factory floor

The factory floor doesn't have a conveyor belt. There's no central system that takes a feature request in one end and delivers shipped code out the other. Instead, there are specialized **workstations**, each one watching for its kind of work and updating state when it's done.

![The Software Factory floor](/images/factory-floor.png)

My first post framed this as a pipeline, and that's the way it's most often presented. A left-to-right flow from RFE to Strategy to Epic to Code to Test to Docs to Build. That sequence exists, and it's the recommended way to route work through the factory. But the components are modular. The test plan generator can pull directly from a feature's acceptance criteria without waiting for code to be written. The autofix agent handles bugs from any source, completely independent of where they sit in any pipeline sequence.

Manufacturing has a name for this kind of arrangement. A **job shop** is a factory with specialized stations that activate when work arrives at their queue, as opposed to an assembly line where material flows through fixed stations in a fixed sequence. Our Software Factory is akin to a job shop. The pipeline diagram is the instruction guide for how to route work through the shop, but the shop itself is more flexible than any single routing suggests.

This is why teams can adopt pieces independently. You don't need to commit to the full pipeline to get value from a single workstation.

---

## What's in the tool bag

Each component follows the same pattern I described in the first post. An agent does the work, a rubric scores the output and attempts auto-revision if the score is low, and a human reviews and signs off.

Most of the components are built as [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills and plugins, LLM-powered agents that run both interactively in an engineer's IDE and headlessly in CI pipelines. Skills are project-specific workflows. Plugins are reusable scoring engines and tools that multiple components can share. The agents interact with Jira through a mix of MCP integrations and direct REST API calls, and produce artifacts like PRs, documentation merge requests, and evaluation reports.

Here's what's on our factory floor today.

### [RFE Creator](https://github.com/opendatahub-io/rfe-creator) + [Assess RFE](https://github.com/opendatahub-io/assess-rfe)

Incoming feature requests scored against a 5-criterion rubric, auto-revised where possible, and submitted to Jira.

<img src="/images/rfe-rubric.png" alt="RFE Quality Rubric" style="display:block;max-width:360px;margin:1em auto;">

The rubric scoring engine is a separate, reusable plugin that other components can plug into. The full lifecycle (create, review, revise, split, submit) runs in CI with headless and dry-run modes, so it can process batches without human interaction until the review step.

### [STRAT Creator](https://github.com/ederign/strat-creator)

Approved RFEs become features that our teams will implement, each with a technical strategy attached.

![Feature scoring rubric, two-workspace model, and architecture context](/images/strat-creator-flow.png)

A scoring rubric evaluates each feature across four dimensions. CI generates the feature strategies and scoring reports, and engineers pull them into a local workspace for review. The strategy agent also pulls from a shared architecture context repository to ground its recommendations in existing system design decisions.

### [Autofix](https://github.com/opendatahub-io/autofix-skills)

This component has a two-layer architecture.

![Autofix two-layer architecture](/images/autofix-architecture.png)

An inner layer of skills runs inside an agent container handling the actual bug fixing and code generation. An outer layer, powered by [agentic-ci](https://github.com/opendatahub-io/agentic-ci) (more on this in the shared infrastructure section below), manages orchestration and Jira ticket management. The agent triages bug tickets for AI readiness, generates code fixes as PRs, and iterates on review feedback. Security gates include secret scanning and filtering to internal reviewers only.

### [Test Generator](https://github.com/opendatahub-io/odh-test-gen)

Generates structured test plans from features, scored across five dimensions where all five must reach the top score to pass. Auto-revises up to two cycles before a human test engineer signs off. The team developing this component is moving toward generating tests directly from a feature's acceptance criteria, which connects feature creation to test generation without needing code to exist first.

### [Docs Generator](https://github.com/tarilabs/doc-creator)

Label-triggered doc generation. When a feature is ready for documentation, adding a label (`ai1st-doc-start`) to the Jira issue triggers the doc generator. The label swaps through a lifecycle (`invoked`, then `contributed`) as the agent generates documentation merge requests. What used to take roughly two weeks now takes about two hours.

### [AI Ops](https://github.com/opendatahub-io/aiops-infra) (build and release)

When a new component needs to be onboarded into the build system, this plugin handles it. An interactive skill collects onboarding parameters, validates them against a schema, and creates a Jira ticket with a structured YAML attachment. From there, a CI job running every two hours picks up the ticket, executes the onboarding steps sequentially across multiple repositories (container registry, Konflux, operator bundles, product listings), and raises PRs for each step. Every PR gets human review before merging. What used to take nearly a month per component now takes about three days.

![Build and release onboarding flow](/images/build-release-flow.png)

---

## The switchboard

What makes these components a system rather than a collection of scripts is that every one of them reads from and writes to the same coordination layer. That layer is Jira.

Jira issues are the work items. Labels signal state transitions. JQL queries are how each agent finds its work. When an agent finishes, it updates Jira, and the next one in the sequence can pick up from there.

Think of Jira as a switchboard. Each workstation has wired itself in by defining what it listens for.

![Jira as a self-routing switchboard](/images/jira-switchboard.png)

- The RFE assessment agent watches for new RFE submissions
- The strategy agent queries for approved RFEs that haven't been turned into features yet
- The documentation agent watches for a specific label (`ai1st-doc-start`) that signals dev work is complete

None of them know about each other directly. They know about the switchboard, and the switchboard connects them.

There's no operator manually routing work through the board. Each agent defines its own entry criteria. If the criteria are met, the agent activates. If a human wrote the RFE by hand instead of using the RFE creator, the strategy agent picks it up the same way. It doesn't care how its input was produced, only that the input exists and meets its criteria.

---

## The shared infrastructure

Some components serve the whole factory rather than handling a single stage.

- **Architecture context** is the factory's institutional memory for system design decisions. Both the RFE and strategy agents consume it for feasibility checks and technical recommendations.
- **The agent eval harness** measures how well agent skills perform, with MLflow integration for tracking results across runs. The autofix agent uses it with 14 evaluation cases today.
- **The skills registry** packages and distributes agent skills across teams and tools, with container images available for CI environments.
- **The agentic CI framework** provides sandboxed execution environments for running agents safely, from local execution to Podman containers to kernel-level sandboxing. Designed to run any agent, not just autofix.

---

## What's missing, and what's already working

Two components from the original pipeline diagram don't exist yet.

**Epic and story decomposition** sits in the gap between "approved feature" and "code-ready work items." There's an early prototype, but the full decomposition from feature to engineering tasks hasn't been built yet. This is worth watching because it's the step where high-level intent becomes concrete engineering work.

**Spec-to-code** is an emerging prototype that takes a feature specification end-to-end to working code through an agent loop via PR comments. An agent generates code, submits a PR, a reviewer comments, and the agent iterates. Currently limited to single-component issues, but it bridges the gap between having a feature spec and having working code.

**Security review** was originally planned as its own component, but it turns out that quality and security gates are built into every agent rather than bolted on as a separate pass. The autofix agent has its own security gates. The strategy agent has its own rubric-based reviewers. Each component ships with built-in checks that evaluate its output before a human sees it.

The full end-to-end flow from RFE through shipped code hasn't been connected yet. Individual components work and have already demonstrated value on their own, but the complete sequence running as an integrated system is still ahead of us.

That said, there's plenty of value already being realized from the individual pieces. We have visibility into parts of our delivery process that we didn't have before. Areas that were genuine bottlenecks, like RFE approval, are measurably more efficient. And the modular design means teams don't have to wait for the full integration to benefit from the components that are ready now. The end-to-end connection is the direction, and we can see the path. But it's not a prerequisite for getting value out of the factory floor as it exists today.

---

## Going deeper

Each of these components has its own story, and future posts will go inside them.

If you read the first post and wondered what this actually looks like in practice, this is the map. A set of specialized workstations wired into a shared switchboard, each one independently useful, designed to compose into larger workflows as the system matures. The pipeline is just one set of instructions. The factory is the floor.

---

<img src="/images/crafted-with-love.png" alt="Crafted with love" style="display:block;width:250px;margin:0 auto 4px auto;"><p style="text-align:center;margin:0;">*Author: Christopher Bynum · AI-assisted drafting (Claude Opus 4) · Human-directed, human-reviewed*</p>
