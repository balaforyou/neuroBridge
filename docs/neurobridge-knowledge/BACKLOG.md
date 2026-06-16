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

## Expression & Logic Backlog

- Story ID: NB-AUD-001
- Title: Audio Chain Completer
- Domain: Expression & Logic
- Epic: EPIC 6 - Narrative Expression & Memory Externalization
- Priority: P1
- Status: Backlog
- Problem Statement: Adarsh demonstrates stronger language retrieval when language is embedded within rhythmic and predictable auditory structures.
- User Story: As a learner, I want to hear part of a familiar auditory sequence and complete the missing portion so that I can strengthen memory retrieval, verbal sequencing, and language production with gradually reduced support.
- Acceptance Criteria: Play configurable audio cue; pause at configurable breakpoint; child completes next word, phrase, or sequence; support visual-response mode; support parent-confirmed response mode; capture retrieval latency; capture completion accuracy; support automatic cue fading after repeated success; parent can mark sequence as mastered.
- Scaffold Levels: L1 Full audio participation; L2 Complete final word; L3 Complete final phrase; L4 Continue from random cue; L5 Visual cue only; L6 Functional conversational use.
- Telemetry: retrievalLatencyMs, completionAccuracy, cueLengthMs, promptLevel, continuationLength.
- Origin Observation: OBS-AUD-20260615-001
- Notes: Emerging NeuroBridge insight: Self Continuation has now been observed in both cognitive-pattern tasks and auditory-language recall tasks. Future observations should explicitly track whether a learner can independently continue an activity after a minimal initiating cue.

- Story ID: NB-AUD-001.1
- Title: Audio Chain Completer Architecture
- Domain: Expression & Logic
- Epic: EPIC 6 - Narrative Expression & Memory Externalization
- Priority: P1
- Status: Design
- Objective: Design the Audio Chain Completer framework to strengthen auditory memory, sequential recall, language retrieval, verbal confidence, and self-continuation through progressively reduced cues.
- Design Principle: SIRAASH does not test memory. SIRAASH scaffolds retrieval.
- Core Learning Loop: Audio cue -> pause -> learner continues -> feedback -> reduced cue -> independent recall.
- NeuroBridge Hypothesis: Rhythmic and predictable auditory sequences provide a lower-friction route into language retrieval. Once a sequence becomes stable, recognition can progress to recall, continuation, and generation.
- Worksheet Placement: Template 4 - Audio Chain Worksheet, rendered through the shared Worksheet Shell zones for instruction, activity, help, feedback, and celebration.
- Levels: L1 Listen and Sing Along; L2 Final Word Completion; L3 Final Phrase Completion; L4 Random Cue Continuation; L5 Visual Cue Continuation; L6 Functional Generalization.
- Content Types: Songs, counting sequences, days of week, months, functional scripts, and classroom routines.
- Hint Strategy: Progressive support from listen again, to next-word prompt, to first-word or first-sound cue.
- Future Response Modes: Parent confirmed, option selection, and future speech recognition.
- Telemetry: retrievalLatencyMs, promptLevel, completionAccuracy, continuationLength, cueLengthMs.
- Origin Observation: OBS-AUD-20260615-001.
- Supporting Signal: #selfContinuation.
- Relationship To Future Epic: Supports NB-AI-WS-001, where worksheet intelligence may detect songs, reading passages, or verbal sequences and generate Audio Chain activities.
- Notes: Architecture only. No audio services, speech recognition, activity code, or implementation work included in this story.

- Story ID: NB-AUD-001.2
- Title: Audio Chain Generalization Framework
- Domain: Expression & Logic
- Epic: EPIC 6 - Narrative Expression & Memory Externalization
- Priority: P1
- Status: Design
- Problem Statement: The Audio Chain architecture can appear song-centric, but songs are only one example of a broader NeuroBridge sequence-completion scaffold.
- Refinement: Future versions should treat Audio Chain as the first implementation of a generalized Sequence Completion Engine.
- Underlying Skill Progression: Recognize -> Recall -> Continue -> Generate.
- Content Families: Auditory songs, counting chains, weekday chains, month chains, story chains, conversation chains, functional scripts, reading fluency, narration chains, classroom routines, and functional conversations.
- Backlog Outcome: NB-AUD-001 should support non-song sequence completion using the same retrieval scaffolding model, with audio remaining one input mode rather than the only content type.
- Notes: Documentation-only refinement. No implementation, renaming, audio services, speech recognition, or activity code changes included.

## Future Ideas

- Story ID: NB-AI-WS-001
- Title: SIRAASH Worksheet Intelligence
- Epic: Worksheet Intelligence
- Priority: P2
- Status: Future Backlog
- Vision: SIRAASH should accept a worksheet image from school and transform it into a personalized NeuroBridge learning experience aligned to the learner's current capabilities.
- Problem Statement: Traditional worksheets assume a fixed learner capability. Parents currently adapt school worksheets manually by reducing complexity, adding visual support, creating intermediate scaffolds, and guiding discovery.
- User Story: As a parent, I want to upload a school worksheet and receive a scaffolded NeuroBridge version so that my child can practice at an achievable level and gradually progress toward the original worksheet.
- High-Level Flow: Worksheet image upload -> worksheet analysis -> skill detection -> difficulty estimation -> scaffold generation -> worksheet shell rendering -> hint and feedback integration -> progress tracking.
- Phase 1: Worksheet Understanding. Accept photograph, scan, PDF page, or mobile camera capture; detect text, pictures, symbols, layout, and question types.
- Phase 2: Skill Classification. Potential categories include matching, sorting, pattern recognition, counting, basic arithmetic, reading, comprehension, narration, sequencing, and functional life.
- Phase 3: Difficulty Estimation. Estimate Too Easy, Appropriate, Stretch, or Too Difficult using observation history, completed activities, hint dependency, and success rates.
- Phase 4: Scaffold Generation. Create a Bridge Worksheet between the learner's current ability and the target task instead of recreating the original worksheet directly.
- Phase 5: Worksheet Shell Integration. Generated content should render through existing worksheet templates such as Matching, Guided Discovery, Pattern Builder, Narration, Audio Chain, and Functional Life.
- Future Capabilities: Adaptive hint generation, dynamic difficulty, and parent-reviewed observation draft generation.
- Guardrail: SIRAASH should promote independence and confidence. It should not be optimized to complete worksheets for the learner or generate answers in place of learning.
- Depends On: NB-101.4.5.2 Worksheet Shell; NB-WS-001 Matching Worksheet; NB-AUD-001 Audio Chain Completer; Knowledge Base; Observation Tracking.
- Potential Telemetry: worksheetType, detectedSkill, scaffoldLevel, promptUsage, completionRate, timeToSuccess, returnToOriginalWorksheet.
- Notes: This epic transforms SIRAASH from a collection of activities into an adaptive learning companion that can translate real-world educational material into learner-specific scaffolds. Candidate for P1 after the worksheet ecosystem matures.

- Story ID: NB-AI-WS-001.1
- Title: Observation-Aware Worksheet Intelligence
- Epic: Worksheet Intelligence
- Priority: P2
- Status: Future
- Problem Statement: Two learners can receive the same school worksheet but should not necessarily receive the same scaffold. Worksheet analysis and skill detection are incomplete without learner context.
- Refinement: Future SIRAASH worksheet generation should consume observation history, prompt dependency, skill mastery, self-continuation signals, recent successes, and recent struggles before selecting scaffolds.
- Future Workflow: Worksheet -> Skill Detection -> Observation Retrieval -> Scaffold Selection -> Worksheet Generation.
- Observation Signals: #selfContinuation, prompt dependency, skill mastery, recent successes, recent struggles, hint dependency, and parent-noted scaffold responses.
- Example: For "Find the object that starts with B", a learner with strong matching and self-continuation may receive a picture matching bridge; a learner with strong reading and weak categorization may receive a word-based categorization bridge.
- NeuroBridge Differentiator: Most AI systems generate content. SIRAASH should generate personalized scaffolds based on observed learner behavior.
- Depends On: OBSERVATIONS.md; FOUNDATION.md; knowledge signals; Worksheet Shell; NB-AI-WS-001.
- Notes: Documentation-only refinement. No implementation, AI service integration, retrieval pipeline, or activity code changes included.

- Story ID: NB-WS-001
- Title: Matching Worksheet Template
- Domain: Executive Function & Cognitive Shifting
- Epic: Worksheets
- Priority: P1
- Status: Backlog
- User Story: As a learner, I want to match pictures, objects, attributes, and functions so that I can develop visual discrimination, categorization, and early reasoning skills.
- Acceptance Criteria: Supports image-to-image matching; image-to-word matching; attribute matching; functional matching; hint integration; shared feedback integration; milestone celebration integration; analytics integration; responsive worksheet shell.
- Scaffold Levels: L1 Exact Matching; L2 Picture to Picture; L3 Picture to Word; L4 Attribute Matching; L5 Functional Matching.
- Notes: Foundational worksheet template and first step in the NeuroBridge reasoning ladder: Matching -> Sorting -> Patterns -> Rules -> Generalization. See `docs/design-system/WORKSHEET_ARCHITECTURE.md`.

- Story ID: NB-WS-001.1
- Title: Matching Worksheet V1
- Domain: Executive Function & Cognitive Shifting
- Epic: Worksheets
- Priority: P1
- Status: Done
- Notes: Implemented the first learner-facing worksheet activity at `games/matchingWorksheet/` using `createWorksheetShell`. V1 supports exact image/card matching with deterministic apple, ball, and cat pairs, tap-to-select interaction, progressive hints, shared feedback, no routine celebration trigger, Node logic tests, and Playwright viewport smoke tests.

- Story ID: NB-WS-001.2
- Title: Attribute Matching Worksheet
- Domain: Executive Function & Cognitive Shifting
- Epic: Worksheets
- Priority: P1
- Status: Done
- Notes: Implemented the next worksheet step at `games/attributeMatchingWorksheet/` using `createWorksheetShell`. Learners match shared properties instead of identical objects through deterministic color, shape, and size prompts, single-select choices, progressive hints, shared SIRAASH feedback, no routine celebration trigger, Node logic tests, and Playwright viewport smoke tests.

- Story ID: NB-WS-001.2.a
- Title: Attribute Reasoning Progression
- Domain: Executive Function & Cognitive Shifting
- Epic: Worksheets
- Priority: P2
- Status: Future Backlog
- Objective: Define the future scaffold ladder for Attribute Matching from visible properties to functional properties, conceptual properties, and multi-attribute reasoning.
- NeuroBridge Progression: Identity -> Attribute -> Function -> Category -> Abstraction.
- Attribute Ladder: L1 Visible Attributes such as red, blue, round, square, big, and small; L2 Functional Attributes such as used for eating, writing, travelling, or cleaning; L3 Conceptual Attributes such as living things, transport, food, animals, people, and plants; L4 Multi-Attribute Reasoning such as red and round, big and living, or used for eating and metal.
- Cognitive Demand: L1 requires direct visual observation; L2 requires understanding purpose; L3 requires category formation; L4 requires simultaneous processing of multiple attributes.
- Future Analytics: attributeType, attributeLevel, singleAttributeSuccessRate, multiAttributeSuccessRate, hintUsageByAttributeLevel.
- Architectural Observation: Introduces a future NeuroBridge abstraction ladder: See It -> Describe It -> Use It -> Group It -> Reason About It.
- Notes: Documentation-only refinement. Current NB-WS-001.2 remains focused on visible attributes. No implementation, analytics behavior, or activity code changes included.

- Story ID: NB-KQ-001
- Title: Kumon Quiz Activity v1.0
- Domain: Numeracy
- Epic: Worksheets
- Priority: P1
- Status: Done
- Purpose: Implement the first arithmetic worksheet-style activity using Worksheet Activity Template v1.0.
- Acceptance Criteria: Uses frozen Worksheet Activity Template v1.0; includes SIRAASH Activity Shell header; main task and support panel follow the template; uses shared SIRAASH feedback and completion helper; preserves analytics/session contracts; includes Node and Playwright coverage.
- Notes: Implemented as `games/kumonQuiz/` with learner-facing Number Bridges tile, addition-only v1, configurable defaults, scaffolded hints, smooth correct-answer advance, completion summary, wrong-answer list, per-attempt trial analytics, Node tests, and Playwright viewport coverage.

- Story ID: NB-101.4.5.1
- Title: Worksheet Architecture Specification
- Epic: Design System
- Priority: High
- Status: Design
- Notes: Documentation-only worksheet shell specification covering instruction, activity, help, feedback, and celebration zones. See `docs/design-system/WORKSHEET_ARCHITECTURE.md`.

- Story ID: NB-101.4.5.2
- Title: Worksheet Shell Implementation
- Epic: Design System
- Priority: High
- Status: Done
- Notes: Implemented reusable worksheet shell foundation with five zones, template registry constants, progressive hints, SIRAASH feedback mount, and inactive celebration placeholder. See `js/worksheetShell.js`.

- Story ID: NB-110
- Title: Printable Worksheet Framework
- Epic: Worksheets
- Priority: Medium
- Status: Backlog
- Notes: Matching, fill-in-the-blanks, measurement, ordering, and worksheet support.

Backlog ID:
NB-060.14

Title:
Shell-to-Activity Message Contract

Epic:
Platform Readiness

Priority:
Medium

Status:
Done

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
NB-060.16

Title:
Browser Visual Smoke Tests

Epic:
Platform Readiness

Priority:
Medium

Status:
Done

Problem:
Node tests cannot catch layout clipping, viewport overflow, or partially
hidden learner controls.

Objective:
Add browser-level visual smoke tests for high-risk learner layouts.

Scope:
- Attribute Explorer answer/help visibility
- Matrix next button visibility
- Activity Hub tile layout
- Mobile and tablet viewport checks

Outcome:
Layout regressions are caught before learner review.

Notes:
Implemented with Playwright viewport smoke tests for Activity Hub,
Attribute Explorer, and Matrix Reasoning across desktop and tablet
viewports. Documentation and Node layout-contract tests remain useful
but are not a replacement for browser-level visual checks.

Backlog ID:
NB-060.17

Title:
Normalize Test Runner Module Mode

Epic:
Platform Readiness

Priority:
Medium

Status:
Done

Problem:
Current Node runners use ESM imports while package.json may remain CommonJS.

Objective:
Normalize the Node test runner module mode so local and CI executions do not
depend on Node version-specific module detection.

Notes:
Implemented with explicit ESM module scopes under js/ and games/, plus a
CommonJS Node regression orchestrator at scripts/run-node-regression.cjs.
Root package.json remains CommonJS.


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
