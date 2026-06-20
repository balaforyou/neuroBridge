# SCH-FREEZE-001

## Schulte Family V1 Architecture Freeze

Status: Frozen

## Vision

The Schulte Family is a progressive cognitive training activity focused on:

- Visual Search
- Attention
- Cognitive Flexibility
- Working Memory
- Auditory Processing
- Fluency Development

The family should provide a scaffolded progression from simple visual search activities through advanced Gorbov Schulte variants.

## End Goal

Ultimate progression target:

```text
Elite Gorbov Schulte
```

All intermediate activities exist to build prerequisite skills required for successful Gorbov performance.

## Learning Philosophy

Progression follows:

```text
Learn -> Practice -> Memory -> Mastery -> Fluency
```

Progression is based on demonstrated mastery rather than activity completion.

## Grid Progression

Entry level:

```text
3x3
```

Progression:

```text
3x3 Ascending
3x3 Descending
4x4
5x5
6x6
```

A grid size may only unlock after mastery and fluency of both ascending and descending variants.

## Modes

### Supported V1

Ascending:

```text
1 -> 2 -> 3 -> ...
```

Descending:

```text
9 -> 8 -> 7 -> ...
```

Memory Mode:

Selected cells no longer visually change state. Learner must internally track progress.

Listen & Find:

The system speaks the target number, such as "Find 7". The learner must locate and select the number. Speech recognition is not required.

### Supported Later

Multiples:

```text
2 4 6 8
3 6 9 12
5 10 15 20
```

Advanced track.

Peripheral Mode:

Target displayed centrally. Learner encouraged to maintain central gaze. Advanced track.

Gorbov Mode:

Advanced end-state activity.

## Session Structure

Levels 1-2:

```text
Board 1
Board 2
```

Both boards are visual.

Level 3+:

```text
Board 1 Visual
Board 2 Visual
Board 3 Listen & Find
```

Auditory board is introduced from Level 3 onwards.

## Layout Strategy

Initial layout:

```text
Square Grid
```

Future layout:

```text
Honeycomb Grid
```

Progression:

```text
3x3 Square
4x4 Square
5x5 Square + Honeycomb Introduction
6x6 Primarily Honeycomb
```

## Board Generation

Boards must be randomized.

Example session 1:

```text
1 4 7
8 2 5
6 9 3
```

Example session 2:

```text
8 3 1
5 9 7
2 4 6
```

Board layouts must not repeat intentionally.

## Feedback System

Correct selection:

- Play click sound.
- Learning and Practice stages may additionally change cell colour.

Incorrect selection:

- Display gentle orange pulse.
- Do not show red error, cross mark, or error buzzer.

Perfect board:

- Condition: zero errors.
- Play success sound.

Level advancement:

- Play celebration sound.

## Mastery Model

Mastery requires:

- 99% accuracy
- Stable completion times
- Consistent performance across sessions

Single-session success does not imply mastery.

## Fluency Model

Timer is not introduced immediately. The system first observes natural mastery performance.

Example:

```text
78s
80s
79s
81s
```

Natural mastery time:

```text
80 seconds
```

Fluency target uses this baseline. Timer should reinforce existing competence rather than create pressure.

## Analytics

Track:

- Accuracy
- Completion Time
- Misses
- Mode
- Grid Size
- Session
- Mastery State
- Fluency State

## Practice Lab

Practice Lab is separated from the Learning Path.

Purpose:

- Parent experimentation
- Skill exploration
- Advanced trials

Practice Lab sessions must not influence:

- Mastery
- Progression
- Fluency
- Official analytics

## Parent Experience

Learning Path progression is system-driven. Parent should not manually modify progression difficulty.

Parent experimentation belongs in Practice Lab.

## Supported V1

- 3x3 Grid
- Ascending
- Descending
- Two Board Sessions
- Listen & Find
- Feedback Engine
- Timing Capture
- Basic Analytics

## Not Supported V1

- Honeycomb Layout
- Multiples Mode
- Peripheral Mode
- Gorbov
- Adaptive AI
- Voice Recognition
- Custom Themes
- Multiplayer

## Potential Confusion Areas

- Memory Mode is not Hidden Board.
- Auditory Mode is not Speech Recognition.
- Multiples Mode is not Grid Difficulty.
- Practice Lab is not Learning Path.
- Fluency is not Mastery.
- Honeycomb Layout is not Difficulty Increase.

## Assumptions

- Browser audio/TTS is acceptable.
- Desktop-first implementation.
- High contrast visual theme.
- Feedback Engine is shared across NeuroBridge activities.

## Definition Of Success

A learner can progress from:

```text
3x3 Ascending
3x3 Descending
4x4
```

using the Learn -> Practice -> Memory -> Mastery -> Fluency progression model while preserving analytics integrity and maintaining a positive feedback experience.
