---
title: "What's on our Factory Floor"
date: 2026-07-07T00:00:00-04:00
lastmod: 2026-08-06T00:00:00-04:00
draft: false
tags: ["ai", "software-factory", "agentic-sdlc", "engineering-leadership"]
description: "The Software Factory isn't one pipeline. It's a set of specialized workstations wired into a shared switchboard. Here's what's actually on the floor."
---

In my [last post](/posts/what-is-a-software-factory/), I described what a Software Factory is and why my organization is building one. I intentionally kept the view as accessible as possible, framing the factory as a pipeline of agents with quality gates and human checkpoints at each stage.

That's a useful mental model for understanding the concept. But now that we're looking at what's actually in place, the picture gets more interesting.

---

## The factory floor

The factory floor actually doesn't have a conveyor belt at all. There's no central system that takes a feature request in one end and delivers shipped code out the other. Instead, there are specialized **workstations**, each one watching for its kind of work and updating state when it's done.

![The Software Factory floor](/images/factory-floor.png)

My first post framed this as a pipeline, and that's the way it's most often presented. A left-to-right flow from RFE to Feature to Epic to Code to Test to Docs to Build. That sequence exists, and it's the recommended way to route work through the factory. But the components are modular. Workstations typically follow that route, and they can optionally take a different path when the work doesn't need every station. For example, the test plan generator can pull directly from a feature's acceptance criteria without going through the Code station first. The autofix agent can handle bugs from any source, independent of where they sit in the usual pipeline sequence.

Manufacturing has a name for this kind of arrangement. A **job shop** is a factory with specialized stations that activate when work arrives at their queue, as opposed to an assembly line where material flows through fixed stations in a fixed sequence. Our Software Factory is akin to a job shop. The pipeline diagram is the instruction guide for how to route work through the shop, but the shop itself is more flexible than any single routing suggests.

This is why teams can adopt pieces independently. You don't need to commit to the full pipeline to get value from a single workstation.

---

## The workstations

Each component follows the pattern I described in the first post. An agent does the work, a rubric scores the output and attempts auto-revision if the score is low, and a human reviews and signs off.

Most of the components are [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills and plugins that run both interactively in an engineer's IDE and headlessly in CI pipelines. Skills are component-specific workflows. Plugins are reusable scoring engines and tools that multiple components can share. The factory agents interact with Jira through a mix of MCP integrations and direct REST API calls, and produce artifacts like PRs, documentation merge requests, and evaluation reports.

Here's what's on our factory floor today.

### [RFE Creator](https://github.com/opendatahub-io/rfe-creator) + [Assess RFE](https://github.com/opendatahub-io/assess-rfe)

This is where incoming feature requests enter the factory. An agent scores each request against a five-criterion rubric, revises the weak parts when it can, and only then submits to Jira, so the board starts with something closer to a real RFE than a half-written ask. The rubric scoring engine is a separate, reusable plugin that other components can plug into. The full lifecycle (create, review, revise, split, submit) runs in CI with headless and dry-run modes, so it can process batches without human interaction until the review step.

<img src="/images/rfe-rubric.png" alt="RFE Quality Rubric" style="display:block;max-width:360px;margin:1em auto;">

### Features ([STRAT Creator](https://github.com/opendatahub-io/strat-creator))

Once an RFE clears the gate, STRAT Creator turns it into a Feature with a generated technical strategy, scores that strategy on four dimensions in CI, then engineers pull the strategy and review artifacts into a local workspace for sign-off. STRAT is our Jira issue type for those Features. STRAT Creator also pulls from a shared architecture context repository so recommendations sit on top of product decisions we have already made, not a blank slate.

![RFE to strategy and Jira Feature via CI scoring, then local pull/push review](/images/strat-creator-flow.png)

### [Epic Creator](https://github.com/opendatahub-io/epic-creator)

Signed-off strategies do not stay as documents. **Epic Creator** turns each one into a set of epics with clear dependencies, then reviews that plan before it lands in Jira. Those epics come in two types. **Investigation epics** resolve unknowns that could change the plan. **Implementation epics** produce a concrete deliverable for a single component. Each epic gets an AI-implementability score. An adversarial review then checks that the set of epics covers the strategy and that the dependency order is right. Approved epics land in Jira with links that encode what must finish before what, so independent epics can be worked in parallel while docs and integration stay last in line. Investigation epics are picked up next by **Epic Investigator**. Implementation epics feed **Epic Code Gen**. The factory stops at epics. Finer story breakdown stays with teams or happens later during code generation.

![Signed-off STRAT through decompose and review to Investigation and Implementation Jira epics](/images/epic-creator-flow.png)

### [Epic Investigator](https://github.com/jwforres/epic-investigator)

Some epics are really open questions masquerading as well-defined work. Those are the Investigation epics Epic Creator already put on the board, the unknowns that have to be answered before the Implementation epics behind them know the right approach. Epic Investigator is the workstation that resolves them. It is a Claude Code skill that picks each Investigation epic up from Jira and chooses the lightest way to answer its questions, whether that means looking it up, trying it locally, or deferring anything that needs a real cluster. Then it gathers evidence and adversarially checks the claims. The output is a go/no-go report attached back to the epic so dependent implementation can proceed with something firmer than a guess. When a question needs a cluster, it does not fake an answer in the sandbox. It parks a runnable spec for later instead.

![Investigation epic through evidence gathering to a go/no-go report for Implementation](/images/epic-investigator-flow.png)

### [Epic Code Gen](https://gitlab.com/redhat/rhel-ai/agentic-ci/epic-code-gen-pipeline)

When an implementation epic is ready for code, this workstation implements it against the target repo and opens a PR that has already been through agent review. Spec and plan come first, then test-driven implementation, then four independent reviewers covering architecture, tests, lint, and intent. Failed reviews iterate. Passing work opens one PR (epics are sized for a single repository). From there, review comments (from bots or humans) can go back into another codegen pass until a human merges it. The diffs often look large. That's not feature sprawl. The codegen path is deliberately heavy on tests, often several times the size of the production change, so the PR lands as ready as possible and needs fewer passes to get across the line.

![Epic Code Gen flow from epic to reviewed PR](/images/epic-code-gen-flow.png)

### [Autofix](https://github.com/opendatahub-io/autofix-skills)

Where Epic Code Gen implements features, Autofix remediates bugs and CVEs. It has a two-layer architecture. An inner layer of skills runs inside an agent container handling the actual bug fixing. An outer layer, powered by [agentic-ci](https://github.com/opendatahub-io/agentic-ci) (more on this in the shared infrastructure section below), manages orchestration and Jira ticket management. The agent triages bug tickets for AI readiness, generates code fixes as PRs, and iterates on review feedback. Security gates include secret scanning and filtering to internal reviewers only.
![Autofix two-layer architecture](/images/autofix-architecture.png)

### Security review

Strategies get a security pass before they harden into implementation plans. A checklist covering auth, data protection, FIPS, and tenant isolation runs as a fifth reviewer skill inside Strat Creator, alongside feasibility, testability, scope, and architecture. The checklist was derived from hundreds of prior strategy reviews. Security is less a standalone workstation and more a habit distributed across the other stations.

### [Test Generator](https://github.com/opendatahub-io/odh-test-gen)

Quality work does not have to wait for code to land first. This workstation generates structured test plans from feature specifications, scored across five dimensions where all five must reach the top score to pass, auto-revising up to two cycles before a human signs off. The team developing this component is moving toward generating tests directly from acceptance criteria, so test planning can optionally start before implementation when the criteria are detailed enough to work from.

![Test generation flow](/images/test-gen-flow.png)

### [Docs Generator](https://github.com/tarilabs/doc-creator)

Documentation used to take roughly two weeks to produce after a feature was ready. Now a label on the Jira issue kicks off the doc generator, which produces documentation merge requests in about two hours. The agent updates the label at each stage so progress is visible on the board. Epic Creator also creates documentation epics early in the dependency chain, held until the related implementation work is done.

![Doc creator label lifecycle](/images/doc-creator-flow.png)

### [AI Ops](https://github.com/opendatahub-io/aiops-infra) (build and release)

Onboarding a new product component into our build system used to take nearly a month. This plugin brings that down to about three days. An interactive skill collects onboarding parameters, validates them against a schema, and creates a Jira ticket with a structured YAML attachment. From there, a CI job running every two hours picks up the ticket, executes the onboarding steps sequentially across multiple repositories (container registry, Konflux, operator bundles, product listings), and raises PRs for each step. Every PR gets human review before merging.

![Build and release onboarding flow](/images/build-release-flow.png)

---

## The switchboard

What makes these components a system rather than a collection of scripts is that every one of them reads from and writes to the same coordination layer. That layer is Jira.

Jira issues are the work items. Labels signal state transitions. JQL queries are how each agent finds its work. When an agent finishes, it updates Jira, and the next one in the sequence can pick up from there.

Think of Jira as a switchboard. Each workstation has wired itself in by defining what it listens for.

![Jira as a self-routing switchboard](/images/jira-switchboard.png)

- The RFE assessment agent watches for new RFE submissions
- STRAT Creator queries for approved RFEs that haven't been turned into Features yet
- Epic Creator picks up signed-off Features and creates linked epics
- Epic Code Gen picks up approved implementation epics and opens reviewed PRs
- The documentation agent watches for a specific label (`ai1st-doc-start`) that signals dev work is complete

None of them know about each other directly. They know about the switchboard, and the switchboard connects them.

There's no operator manually routing work through the board. Each agent defines its own entry criteria. If the criteria are met, the agent activates. If a human wrote the RFE by hand instead of using the RFE creator, STRAT Creator picks it up the same way. It doesn't care how its input was produced, only that the input exists and meets its criteria.

---

## The shared infrastructure

Some components serve the whole factory rather than handling a single stage.

- **[Architecture context](https://github.com/opendatahub-io/architecture-context)** is the factory's institutional memory for system design decisions. Agents query it for component and repo mapping, feasibility checks, and technical recommendations. Epic Creator and the investigator both lean on it.
- **The agent eval harness** measures how well agent skills perform, with MLflow integration for tracking results across runs. The autofix agent uses it with 14 evaluation cases today, and RFE assessment now emits structured traces as well.
- **The skills registry** packages and distributes agent skills across teams and tools, with a marketplace install path and container images for CI environments.
- **The agentic CI framework** provides sandboxed execution environments for running agents safely, from local execution to Podman containers to kernel-level sandboxing. Designed to run any agent, not just autofix.
- **Component maturity assessment** scans components against Dev Preview, Tech Preview, and GA requirements, replacing manual Jira checklist tickets. Results show up on Org Pulse, and the checks are being wired into Strat Creator and Epic Creator as quality gates.
- **The local AI-first platform** is the factory's sandbox. Fake Jira, GitHub, and GitLab sit on a local Kubernetes cluster so skills can be developed and chained without touching production. A workflow engine and claim-verification system sit alongside it, so teams can prove a pipeline works before pointing it at real tickets.

---

## The system in motion

The full end-to-end flow from RFE through shipped code is still stitching itself together. Individual workstations already deliver value on their own. RFE quality is more consistent. Autofix is merging real PRs. Linked epic plans are landing in Jira for human review. Feature code generation is producing reviewed diffs from approved epics.

That modularity is deliberate. Teams don't have to wait for every station to be production-ready before they use the ones that already help.

---

## Going deeper

Each of these components has its own story, and future posts will go inside them.

If you read the first post and wondered what the factory actually looks like in practice, this is the map. A set of specialized workstations wired into a shared switchboard, each one independently useful, designed to compose into larger workflows as the system matures. This is our factory floor.

---

<img src="/images/crafted-with-love.png" alt="Crafted with love" style="display:block;width:250px;margin:0 auto 4px auto;"><p style="text-align:center;margin:0;">*Author: Christopher Bynum · Human-written, AI-assisted (Claude Opus 4)*</p>
