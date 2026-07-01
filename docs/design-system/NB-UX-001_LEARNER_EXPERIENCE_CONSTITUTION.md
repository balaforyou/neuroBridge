# NeuroBridge Learner Experience Constitution

> NeuroBridge is not designed to teach activities. It is designed to build thinking. Every interface decision exists to reduce unnecessary cognitive effort so the learner can focus entirely on the cognitive skill being developed.

## Purpose

Explain why NeuroBridge exists from the learner's perspective.

The objective is to reduce unnecessary cognitive effort so learners spend their mental energy learning concepts rather than understanding software.

## Reading Order

1. Learner Experience Constitution
2. Activity Surface Contract
3. Activity Shell
4. Activity Family Standards
5. Component APIs

## UX-001.1 Recognition-Based Launcher

## Decision

Learner launcher uses simple activity tiles.

## Evidence Source

- Direct observation of Adarsh
- Platform consistency

## Observation

Learners recognize a familiar tile faster than they read a long menu or select from a dense launcher.

## Why it Matters

Recognition over reading reduces startup friction and makes the first interaction calmer.

## Learner Example

A learner taps a single activity tile without needing to read a long activity description.

## Platform Implication

Launcher surfaces should use simple recognition-based activity tiles.

## Activity Examples

Directions, Schulte, Number Bridges, Matching, Pattern Memory.

## Components Affected

- Activity Shell
- Activity UI Families
- Learner Launcher

## Implementation Notes

Entire tile should be clickable. Descriptions should be omitted from the launcher tile surface.

## Future Considerations

Some future launcher categories may need badges or progress states, but the default tile should remain simple.

## UX-001.2 Learning Object Dominates

## Decision

Prompt is small, centered, and the learning object occupies the largest visual area.

## Evidence Source

- Direct observation of Adarsh
- Cognitive science

## Observation

Learners stay engaged when the active object is visually dominant and the prompt stays secondary.

## Why it Matters

The learner should spend attention on the task, not on surrounding chrome.

## Learner Example

In Directions, the card grid dominates the view and the prompt remains small.

## Platform Implication

Shared layouts must reserve the largest visual area for the learning object.

## Activity Examples

Directions, Schulte, Matching, Pattern Memory, Number Bridges.

## Components Affected

- Activity Shell
- Activity Surface
- Activity UI Families

## Implementation Notes

Centered learning object, restrained prompt, stable framing.

## Future Considerations

Some future activities may need larger workspaces, but the learning object must remain dominant.

## UX-001.3 Familiar Learning Frame

## Decision

After activity launch, remove activity name and decorative headers. Only keep Home, Prompt, Learning Object, and Feedback.

## Evidence Source

- Direct observation of Adarsh
- Platform consistency

## Observation

Repeated activity names and decorative surfaces create visual noise after launch.

## Why it Matters

A familiar frame helps learners orient quickly without re-learning the layout every time.

## Learner Example

The learner sees the same core frame whether they are in a worksheet, a grid task, or a choice task.

## Platform Implication

Platform shells must own the stable frame and suppress redundant titles after launch.

## Activity Examples

Directions, Schulte, worksheet-style activities.

## Components Affected

- Activity Shell
- Activity Surface
- Completion Surface

## Implementation Notes

Keep the frame consistent across activities; avoid duplicate activity names and decorative headers in the body.

## Future Considerations

Family-specific frames may vary slightly, but the core structure should remain recognizable.

## UX-001.4 Calm High-Contrast Workspace

## Decision

Whitespace is intentional, decoration is minimal, and contrast is high.

## Evidence Source

- Direct observation of Adarsh
- ASD learning principles

## Observation

Learners scan more easily when educational elements are isolated from decorative clutter.

## Why it Matters

The workspace stays readable and calm, especially during repeated practice.

## Learner Example

A board or question surface sits against a clean background with clear contrast.

## Platform Implication

Design tokens and shared components should prioritize legibility and restraint.

## Activity Examples

All learner-facing activities.

## Components Affected

- Activity Shell
- Activity Surface
- Feedback Surface
- Completion Surface

## Implementation Notes

Only educational elements should remain visible. Decorative elements should be minimized.

## Future Considerations

Color can still communicate meaning, but should stay controlled and purposeful.

## UX-001.5 Progressive Disclosure

## Decision

Reveal only information required for the current learning step and hide future information.

## Evidence Source

- Direct observation of Adarsh
- Cognitive science

## Observation

When too much is visible at once, learners can jump ahead cognitively and lose focus.

## Why it Matters

Progressive disclosure keeps the current task clear and avoids overload.

## Learner Example

Hints appear only after the learner asks for help.

## Platform Implication

Shared components should hide unnecessary controls and future-state information until needed.

## Activity Examples

Directions, Matching, worksheet activities, Pattern Memory.

## Components Affected

- Activity Shell
- Activity Feedback
- Completion Surface
- Scaffold Engine

## Implementation Notes

Do not expose future steps, unused controls, or optional panels by default.

## Future Considerations

Some advanced learners may benefit from controlled preview modes, but not in the default learner path.

## UX-001.6 Activity-Owned Scaffolds

## Decision

Platform never owns generic hints; scaffolds belong to activities.

## Evidence Source

- NeuroBridge engineering principle
- Platform consistency

## Observation

Different activities need different scaffold patterns and pacing.

## Why it Matters

Scaffolds should match the cognitive demand of the activity instead of forcing a one-size-fits-all pattern.

## Learner Example

Directions may use a pulse on a chosen card while another activity uses a clue panel.

## Platform Implication

The platform should provide scaffold hooks, not impose a generic hint system.

## Activity Examples

Directions, Schulte, Pattern Memory, Matching.

## Components Affected

- Activity UI Families
- Scaffold Engine
- Activity Shell

## Implementation Notes

Scaffolds belong to the activity unless a repeated pattern is formally extracted into the platform.

## Future Considerations

Some scaffold patterns may later become shared components after repeated observation.

## UX-001.7 Activity UI Families

## Decision

Document learner interface families that share structure, behavior, and scaffold philosophy.

## Evidence Source

- Platform consistency
- Product design reasoning

## Observation

Some activities behave like choice tasks, some like grids, and some like question-and-answer surfaces.

## Why it Matters

UI families make reuse deliberate and keep each activity feeling like part of one platform.

## Learner Example

A grid activity feels like a grid activity whether the content is numbers, letters, or shapes.

## Platform Implication

The platform should define shared family layout APIs rather than custom screens for each activity.

## Activity Examples

Choice Activities, Grid Activities, Question & Answer Activities, Story Activities, Construction Activities.

## Components Affected

- Activity UI Families
- Activity Shell
- Activity Surface
- Scaffold Engine

## Implementation Notes

For each family document purpose, visual hierarchy, scaffold philosophy, workspace layout, and typical activities.

## Future Considerations

New families should be added only when a real repeated pattern appears.

## UX-001.8 Feedback Timing Families

## Decision

Document appropriate feedback timing families rather than forcing one global timing model.

## Evidence Source

- Direct observation of Adarsh
- Product design reasoning

## Observation

Some activities need immediate feedback; others need surface tick feedback or a wait-for-continue state.

## Why it Matters

Timing affects comprehension, pacing, and whether the learner can see both action and response.

## Learner Example

Immediate feedback, surface tick feedback, wait-for-continue, adaptive feedback timing.

## Platform Implication

The platform should support timing families and their activity examples.

## Activity Examples

Directions, Schulte, worksheet completion, future grid tasks.

## Components Affected

- Activity Feedback
- Completion Surface
- Adaptive Timing Engine

## Implementation Notes

Match the timing profile to the learning intent.

## Future Considerations

Timing families may later become configurable per activity or learner profile.

## UX-001.9 Executive Control Scaffolds

## Decision

GO, STOP, WAIT, and READY should be treated as progressive control scaffolds with fading.

## Evidence Source

- ASD learning principles
- Cognitive science

## Observation

Learners benefit from explicit executive control cues before they can internalize self-regulation.

## Why it Matters

Control scaffolds help train inhibition and transition behavior without overwhelming the learner.

## Learner Example

A learner sees a clear READY cue before starting, then the scaffold fades over time.

## Platform Implication

Shared control scaffolds should support progressive fading and consistent placement.

## Activity Examples

Directions, Schulte, future regulation-heavy activities.

## Components Affected

- Executive Control Scaffold Component
- Activity Shell
- Adaptive Timing Engine

## Implementation Notes

Control scaffolds should start explicit and become quieter as the learner gains fluency.

## Future Considerations

The scaffold vocabulary may evolve as more activities require control support.

## UX-001.10 Learner vs Parent Information

## Decision

Learner completion screens contain only Great Work, Score, Accuracy, Time, and Level; diagnostics belong in the Parent Dashboard.

## Evidence Source

- Platform consistency
- Product design reasoning

## Observation

Detailed diagnostics are useful for adults but distract learners from the learning moment.

## Why it Matters

Information separation keeps the learner surface calm and the parent surface useful.

## Learner Example

The learner sees a clean completion summary while parent analytics remain elsewhere.

## Platform Implication

Completion and reporting systems must separate learner and parent information by design.

## Activity Examples

All completion surfaces and parent dashboards.

## Components Affected

- Completion Surface
- Learner Completion Summary Simplification
- Parent Dashboard

## Implementation Notes

Diagnostics should not leak into learner-facing completion UI.

## Future Considerations

Some activity families may add one or two extra learner-visible metrics, but only if they remain calm and useful.

## UX-001.11 Audio Language

## Decision

Audio should use correct tone, mistake tone, completion chime, level celebration, and mastery celebration while supporting learning and never overwhelming.

## Evidence Source

- Direct observation of Adarsh
- Product design reasoning

## Observation

Audio is most useful when it reinforces the task and stays aligned with the on-screen message.

## Why it Matters

Consistent audio language helps learners map what they hear to what they see.

## Learner Example

A correct answer uses a light success tone, while a mistake uses a calm corrective tone.

## Platform Implication

Shared audio hooks should expose canonical tones and keep the audio vocabulary stable.

## Activity Examples

Directions, Schulte, future timed activities, celebration flows.

## Components Affected

- Audio Language system
- Celebration Engine
- Activity Feedback

## Implementation Notes

Audio should support learning, not create sensory overload.

## Future Considerations

Audio intensity may need learner profile controls in later platform work.

## UX-001.12 Motion Language

## Decision

Motion should be purposeful, calm, short, and never decorative.

## Evidence Source

- Direct observation of Adarsh
- ASD learning principles

## Observation

Short, meaningful motion helps the learner notice a state change without pulling attention away from the task.

## Why it Matters

Motion can clarify feedback and transitions if it remains restrained.

## Learner Example

Surface tick, orange pulse, fade, slide, completion appearance.

## Platform Implication

Shared motion patterns should be minimal and aligned with the learner's current action.

## Activity Examples

Directions, Schulte, Matching, completion flows.

## Components Affected

- Activity Feedback
- Completion Surface
- Surface Tick Feedback Component

## Implementation Notes

Motion should emphasize state change, not decoration.

## Future Considerations

Future motion presets may be exposed as a small family of approved patterns.

## UX-001.13 Adaptive Timing

## Decision

Adaptive timing applies to feedback, transitions, celebrations, and animations across Beginner, Intermediate, Mastered, and Fluent states.

## Evidence Source

- Cognitive science
- Platform consistency

## Observation

Different learners and mastery states require different pacing to stay calm and successful.

## Why it Matters

Timing that adapts to the learner helps maintain engagement without rushing or stalling progress.

## Learner Example

A beginner sees slower transitions than a fluent learner.

## Platform Implication

Timing engines should accept learner state and activity context.

## Activity Examples

All learner-facing activities and celebration flows.

## Components Affected

- Adaptive Timing Engine
- Activity Feedback
- Completion Surface
- Celebration Engine

## Implementation Notes

Adaptive timing should be visible in feedback duration, transition pacing, and celebration pacing.

## Future Considerations

Later refinement may add learner-specific timing profiles.

## UX-001.14 Milestone Celebrations

## Decision

Correct answer, round complete, level complete, skill complete, and mastery each receive progressively richer celebration.

## Evidence Source

- Product design reasoning
- Platform consistency

## Observation

Not all positive moments are equally important; the platform should celebrate meaningful progress differently.

## Why it Matters

Milestone celebrations remain meaningful when they reflect actual achievement.

## Learner Example

A correct answer gets a small acknowledgement; mastery gets a richer celebration.

## Platform Implication

Celebration systems should support milestone tiers and escalating richness.

## Activity Examples

Directions, Schulte, Number Bridges, future mastery flows.

## Components Affected

- Celebration Engine
- Completion Surface
- Activity Feedback

## Implementation Notes

Each milestone should have a distinct celebration level and visual weight.

## Future Considerations

Milestone definitions may expand as mastery systems mature.

## UX-001.15 Calm Before Excitement

## Decision

NeuroBridge should spend approximately 95% calm and 5% celebration.

## Evidence Source

- Direct observation of Adarsh
- Product design reasoning

## Observation

The learner's normal state should remain distraction-free; excitement should be reserved for meaningful progress.

## Why it Matters

Celebrations feel more rewarding when they stand out from the calm baseline.

## Learner Example

Most of the session is quiet and focused; a milestone creates a brief moment of excitement.

## Platform Implication

Default platform behavior should bias toward calm surfaces and restrained motion.

## Activity Examples

All learner-facing activities.

## Components Affected

- Celebration Engine
- Activity Shell
- Completion Surface
- Motion Language

## Implementation Notes

Celebration should not destabilize the learning surface or overwhelm the learner.

## Future Considerations

The calm-to-celebration balance may be tuned by learner profile in the future.

## Constitution Review Checklist

Before implementing any learner UI ask:

- Does it reduce cognitive load?
- Does the learning object dominate?
- Does it maintain visual stability?
- Is the scaffold part of the activity?
- Does it fit an Activity UI Family?
- Is feedback appropriate for this activity?
- Is information intended for the learner?
- Does celebration match the achievement?
- Does it comply with the Activity Surface Contract?
- Is this supported by learner evidence?

