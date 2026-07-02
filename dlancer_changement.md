I would actually write this as a **technical product specification**, not just a prompt. The better the specification, the better the generated code will be.

---

# D-Lancer Frontend Refactoring Specification

## Objective

Refactor the existing **D-Lancer** page into a modular, scalable workflow-driven application while preserving the existing BitStack design system, routing, authentication, styling, and shared platform components.

This is **not** a redesign of the BitStack platform. It is a refactor of the D-Lancer module to improve maintainability, user experience, and scalability.

The new implementation must integrate seamlessly with the current platform and reuse existing components whenever possible.

---

# General Requirements

Do **not** modify the global platform layout.

Continue using:

* Existing Topbar
* Existing Sidebar
* Existing Theme
* Existing Tailwind configuration
* Existing color palette
* Existing reusable UI components
* Existing animation style
* Existing icon library
* Existing authentication context
* Existing routing structure

The D-Lancer module should feel like a natural part of BitStack rather than a separate application.

---

# Architecture

The current implementation is too large and should be decomposed into reusable modules.

Create the following structure:

```text
/pages
    DLancer.jsx
    MissionOverview.jsx
    MissionWorkspace.jsx
    MissionArchive.jsx

/components/dlancer

    dashboard/

    marketplace/

    workflow/

    mission/

    milestones/

    meetings/

    files/

    archive/

    shared/

/hooks

/services

/utils
```

Each component must have a single responsibility.

Avoid creating large components exceeding 300–400 lines.

---

# Main Navigation

The D-Lancer home page should contain four primary areas:

* Dashboard
* Marketplace
* Active Missions
* Archive

The Dashboard is the landing page.

---

# Dashboard

Display:

* Personalized greeting
* Search bar
* Active mission summary
* Earnings summary
* Reputation summary
* Continue Working section
* Recommended Missions
* Recent Activity

The Dashboard should provide an overview instead of immediately showing every mission.

---

# Marketplace

The Marketplace displays available missions.

Features:

* Search
* Filters
* Categories
* Sorting
* Recommended missions
* Mission cards

Mission cards should remain clean and minimal.

Each card should display:

* Title
* Client
* Required skills
* Estimated duration
* Budget
* Number of interested freelancers
* Difficulty
* Status

Primary action:

```
View Mission
```

---

# Mission Overview

Selecting a mission opens a dedicated overview page.

Display:

Mission information

Client information

Deliverables

Required skills

Timeline

Attachments

Frequently Asked Questions

Discussion preview

No workspace should appear at this stage.

The freelancer has one primary action:

```
I'm Interested
```

No price proposal.

No BTS proposal.

No bidding.

The freelancer simply expresses interest.

An optional motivation field may be included.

---

# Workflow System

The traditional progress bar must be replaced by an interactive workflow timeline.

There are exactly six workflow steps.

```
Browse

↓

Connection

↓

Alignment

↓

Active Work

↓

Final Handoff

↓

Completed
```

The workflow is displayed permanently at the top of every mission page.

---

# Workflow Behavior

Completed steps

* clickable
* read-only
* historical view only

Current step

* fully interactive

Future steps

* locked
* cannot be opened
* visually disabled

The workflow should automatically update based on mission state.

---

# Step 1 — Browse

The freelancer explores missions.

Possible actions:

* View mission
* Bookmark
* Express interest

The client receives a list of interested freelancers.

No negotiations occur in this phase.

---

# Step 2 — Connection

The client reviews interested freelancers.

Each freelancer card displays:

Profile

Portfolio

Skills

Availability

Ratings

Reputation

Previous work

Actions:

Message

Schedule Meeting

Ignore

Accept for discussion

Scheduling must integrate with the existing Calendar module.

Messaging must integrate with the existing Messaging module.

Private meetings must integrate with the existing Private Sessions module.

The platform should automatically create a private conversation linked to the mission.

Meeting invitations should automatically appear in both calendars.

After the meeting, both parties independently decide whether to continue.

Only when both accept does the workflow continue.

---

# Step 3 — Alignment

This phase prepares the project before work begins.

Client defines:

Milestones

Deliverables

Deadlines

Meeting schedule

Resources

Review sessions

Escrow summary

At the beginning of this phase:

100% of project funds are locked.

Automatically release 10% to the freelancer as a fixed project initiation payment.

The remaining 90% remains locked until final acceptance.

This percentage is fixed and should not be configurable.

Every milestone contains:

Description

Deadline

Review meeting

Expected deliverables

Notes

Milestones are for planning and review only.

Work submission is not allowed during this phase.

---

# Step 4 — Active Work

The freelancer performs the project.

Workspace should integrate:

Messages

Private Sessions

Calendar

Milestones

Notes

Timeline

Shared files

Progress meetings

Each milestone includes scheduled review meetings.

Meetings evaluate progress only.

Deliverables are not submitted during this stage.

---

# Step 5 — Final Handoff

The final milestone enables project delivery.

Accepted deliverables include:

ZIP files

GitHub repositories

GitLab repositories

Bitbucket repositories

Google Drive

OneDrive

Figma

Canva

Notion

Documentation

Video demonstrations

External URLs

Multiple attachments

After submission:

Automatically schedule a Final Demonstration Meeting.

The client reviews the complete work.

Upon approval:

Release remaining escrow funds.

Display a notification informing both users that disputes may be opened within the next 24 hours.

The dispute countdown begins immediately after payment release.

---

# Step 6 — Completed

After the dispute period expires:

Move the mission into Archive.

Everything becomes read-only.

Historical information remains accessible:

Messages

Meetings

Milestones

Timeline

Deliverables

Payments

Notes

Reviews

Ratings

Files

No information may be modified after completion.

---

# Workflow Timeline Component

Create a reusable component:

```
WorkflowTimeline
```

Responsibilities:

Render all workflow steps

Highlight current step

Display completed steps

Lock future steps

Allow navigation to previous completed steps

Prevent editing completed steps

Prevent opening future steps

Animate transitions smoothly

---

# Mission Workspace

The workspace should dynamically render the current workflow step.

Example:

```jsx
<WorkflowTimeline />

<CurrentWorkflowStep />
```

Each workflow step should be implemented as its own component.

Example:

```
StepBrowse.jsx

StepConnection.jsx

StepAlignment.jsx

StepActiveWork.jsx

StepFinalHandoff.jsx

StepCompleted.jsx
```

The workspace simply loads the appropriate component based on workflow state.

Avoid large conditional rendering blocks.

---

# Design Requirements

Maintain the current BitStack visual language.

Improve spacing.

Reduce visual clutter.

Increase whitespace.

Use consistent card sizing.

Use subtle animations.

Keep typography clean.

Do not introduce unnecessary colors.

Use existing platform tokens.

The interface should feel modern, minimal, and professional.

---

# Code Quality Requirements

* Use reusable React components.
* Keep business logic separate from presentation.
* Create reusable hooks where appropriate.
* Avoid duplicated UI.
* Avoid deeply nested conditional rendering.
* Maintain responsiveness for desktop and tablet.
* Preserve compatibility with existing services and APIs.
* Do not break current navigation or authentication.
* Structure the code so future features (disputes, contracts, AI assistance, notifications, analytics) can be added without major refactoring.

---

## Final Goal

The final result should feel less like a traditional freelance marketplace and more like a **professional project collaboration platform**. The workflow should naturally connect BitStack's existing ecosystem—including Messaging, Calendar, Private Sessions, File Storage, and Escrow—into a single, coherent user experience where the workflow timeline acts as the central navigation and state manager for every mission. This architecture should prioritize scalability, maintainability, and a seamless integration with the existing platform rather than introducing a disconnected or standalone interface.
