# Backlog

Purpose: Track future NeuroBridge work before formal Jira entry.

Use this file for lightweight capture of architecture, UI, analytics, assessment, parent experience, research, and future idea items. Keep entries short enough to scan and detailed enough to promote into a formal story later.

## Item Template

- Story ID:
- Title:
- Epic:
- Priority:
- Status:
- Notes:

## Current Sprint

## Architecture Backlog

- Story ID: NB-060
- Title: Technology & Platform Readiness
- Epic: Platform Readiness
- Priority: High
- Status: Backlog
- Notes: Responsive UI, touch standards, automated UI tests, performance, security, privacy, accessibility, and backend adapter readiness.
- Add noscript fallback
- Document iframe/postMessage contract
- Add view manager for hidden/flex state
- Replace Tailwind CDN before public deployment
- Add Playwright smoke tests before beta
- Add IndexedDB persistence before parent dashboard maturity

## UI / UX Backlog

- Story ID: NB-080
- Title: Learner Experience Framework
- Epic: Learner Experience
- Priority: High
- Status: In Progress
- Notes: Splash screen, daily welcome, welcome back, and motivating messages.

- Story ID: NB-100.9
- Title: Motion & Animation Standards
- Epic: Design System
- Priority: Medium
- Status: Backlog
- Notes: Standardize glow, blink, fly-to-cart, transitions, and reduced-motion options.

- Story ID: NB-100.10
- Title: Audio Environment Framework
- Epic: Design System
- Priority: Medium
- Status: Backlog
- Notes: Optional background sound support controlled by parent.

- Story ID: NB-140
- Title: Activity Tile & Learning Path Framework
- Epic: Learner Experience
- Priority: Medium
- Status: Backlog
- Notes: Replace simple Activity Hub lists with visual activity tiles, icons, recommended paths, and assessment-driven activity assignment. Future phases may include static tiles, category tiles, assessment-driven recommendations, adaptive learning paths, parent-assigned activities, and therapist-assigned activities.

## Analytics Backlog

- Story ID: NB-030
- Title: Adaptive Learning Plan Engine
- Epic: Analytics
- Priority: Medium
- Status: Backlog
- Notes: Recommend future games and skills based on analytics.

- Story ID: NB-031
- Title: Composite Parent Indicators
- Epic: Analytics
- Priority: Medium
- Status: Backlog
- Notes: Derived parent-friendly indicators such as Problem Solving, Learning Readiness, Independence, and Focus Stamina.

- Story ID: NB-130
- Title: Adaptive Game Selection
- Epic: Adaptive Learning
- Priority: Medium
- Status: Backlog
- Notes: Recommend curated activities after a fortnight of play.

## Assessment Backlog

- Story ID: NB-040
- Title: Learner Assessment Framework
- Epic: Assessment
- Priority: High
- Status: Backlog
- Notes: Baseline assessment to recommend games for a new learner.

- Story ID: NB-041
- Title: Assessment Safety Framework
- Epic: Assessment
- Priority: High
- Status: Backlog
- Notes: Max consecutive failure circuit breaker and scaffold injection.

- Story ID: NB-120
- Title: Assessment Mode
- Epic: Assessment
- Priority: Medium
- Status: Backlog
- Notes: Baseline mode with controlled hints and scaffolds.

## Parent Experience Backlog

- Story ID: NB-050
- Title: Parent Interaction Integrity
- Epic: Parent Experience
- Priority: Medium
- Status: Backlog
- Notes: Parent assistance capture and suspicious velocity checks.

- Story ID: NB-051
- Title: Session Context Framework
- Epic: Parent Experience
- Priority: Medium
- Status: Backlog
- Notes: Pre-session energy and mood context capture.

## Research / Publication Backlog

- Story ID: NB-070
- Title: Emotional Intelligence Framework
- Epic: Research / EI
- Priority: Medium
- Status: Backlog
- Notes: Future EI/social reasoning layer.

## Future Ideas

- Story ID: NB-110
- Title: Printable Worksheet Framework
- Epic: Worksheets
- Priority: Medium
- Status: Backlog
- Notes: Matching, fill-in-the-blanks, measurement, ordering, and worksheet support.


Domain

Expression & Logic

Epic

EPIC 6 – Narrative Expression & Memory Externalization

Feature

NB-AUD-001: Audio Chain Completer

Problem Statement

Adarsh demonstrates stronger recall and verbal output when language is embedded within rhythmic, predictable auditory patterns. Traditional open-ended language tasks often place a high retrieval demand, whereas familiar auditory sequences provide a scaffold for successful recall.

User Story

As a child, I want to hear part of a familiar auditory sequence and complete the missing portion, so that I can strengthen memory retrieval, verbal sequencing, and language production with gradually reduced support.

Acceptance Criteria
System plays a familiar audio sequence.
Audio pauses at a configurable point.
Child completes the next word, phrase, or sequence.
Completion can be through:
Visual selection
Parent confirmation
Speech recognition (future)
System records retrieval latency.
System records completion accuracy.
Cue length automatically reduces after repeated success.
Parent can mark a sequence as "Mastered."
Initial Scaffolding Levels
Level	Support
L1	Full audio, sing along
L2	Pause before final word
L3	Pause before final phrase
L4	Random line cue
L5	Visual cue only
L6	Functional use of phrase in conversation
Telemetry
Metric	Description
retrievalLatencyMs	Time taken to begin response
completionAccuracy	Correct / Partial / Incorrect
cueLengthMs	Duration of cue provided
promptLevel	Current scaffold level
continuationLength	Number of words/phrases recalled
Parent Observation That Triggered This Backlog

Parent sang a random line from Ekadantaya Vakratundaya while walking. Adarsh independently continued the song and sustained multiple subsequent lines without the original audio source.

NeuroBridge Hypothesis

For bottom-up learners, rhythmic auditory chains can function as memory scaffolds. Strengthening chain completion may improve not only song recall but also narration, sequencing, classroom routines, conversational scripts, and functional language retrieval.

Priority

P1 – Strong Candidate for MVP Inclusion

Sprint Recommendation

Future Readiness → Expression & Logic Track
Target after stabilization of current visual pattern and narration scaffolds.

Backlog ID:
NB-060.14

Title:
Shell-to-Activity Message Contract

Epic:
Platform Readiness

Priority:
Medium

Status:
Backlog

Problem:
Activities run inside isolated activity containers/frames and
communicate with the parent shell. The message contract is
currently implemented but not formally documented.

Objective:
Define and document the standard communication contract between
the SIRAASH shell and activities.

Scope:
- Activity Launch
- Activity Ready
- Session Start
- Trial Result
- Session Complete
- Home Navigation
- Parent Configuration
- Forced Activity/Stage Override

Outcome:
Future activities can integrate consistently without inventing
their own messaging protocol.

Notes:
Documentation-only initially. Implementation remains unchanged.

Backlog ID:
NB-060.15

Title:
NoScript and Graceful Failure Experience

Epic:
Platform Readiness

Priority:
Low

Status:
Backlog

Problem:
The platform currently assumes JavaScript is available.

Objective:
Provide a learner-friendly fallback when scripts fail to load
or are disabled.

Scope:
- noscript message
- friendly recovery guidance
- parent troubleshooting hint

Notes:
Required before public deployment, not required for local-first
MVP usage.


Backlog ID:
NB-110.1

Title:
Learner Profile Expansion

Epic:
Learner Personalization

Priority:
Medium

Status:
Backlog

Problem:
Current learner profile supports only a display name.

Objective:
Expand learner profile structure to support future personalization and multi-learner scenarios.

Current Structure:

{
  displayName: "Adarsh"
}

Future Structure:

{
  learnerId: "adarsh-001",
  displayName: "Adarsh",
  preferredName: "Adi",
  preferredLanguage: "en",
  avatar: "seedling",
  age: 12,
  activeLearningPath: "foundation",
  personalizationEnabled: true
}

Scope:
- Profile model
- Profile persistence
- Personalization support
- Future multi-learner support

Notes:
No implementation required in current MVP.
Current displayName-based personalization remains sufficient.