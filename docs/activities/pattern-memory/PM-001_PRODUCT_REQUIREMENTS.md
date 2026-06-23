# PM-001 Pattern Memory Product Requirements

## Activity Modes

### Copy Mode

Pattern remains visible.

Learner reproduces the pattern.

### Memory Mode

Pattern shown temporarily.

Pattern disappears.

Learner reproduces from memory.

## Grid Sizes

Supported:

- 2x2
- 3x3
- 4x4

Maximum V1 grid:

4x4

## Color System

Supported colors:

- Blue
- Red
- Green

Progression:

- One Color
- Two Colors
- Three Colors

## Interaction Model

### V1

Color palette selection.

Learner selects a color.

Learner taps cells to apply the selected color.

### Future

Click cycling interaction:

Blank -> Blue -> Red -> Green -> Blank

Parent-selectable interaction modes may be introduced later.

## Difficulty Dimensions

Difficulty determined by:

- Grid Size
- Filled Cell Count
- Color Count
- Display Duration
- Pattern Complexity

## Filled Cell Density

Start:

1 filled cell

Maximum:

50% of board capacity

Examples:

- 2x2 -> max 2 cells
- 3x3 -> max 4 cells
- 4x4 -> max 8 cells

## Display Duration

Memory Mode only.

Supported range:

- 10 seconds
- 8 seconds
- 6 seconds
- 5 seconds
- 4 seconds
- 3 seconds
- 2 seconds

## Pattern Generation

Allowed:

- Same colors touching
- Full rows
- Full columns
- Symmetry
- Corner-only layouts
- Adjacent cells
- Diagonal layouts

Pattern complexity levels:

- Structured
- Semi-Random
- Random

Generator complexity is hidden from the learner.

## Session Structure

Questions per session:

10

Difficulty remains stable during a session.

Difficulty evaluation occurs between sessions.

## Adaptive Progression

Promote:

- Accuracy >= 85%
- Two consecutive sessions

Maintain:

- Accuracy 60%-84%

Fallback:

- Accuracy < 60%

System may automatically return to a previously successful difficulty level.

No manual intervention required.

## Progression Tracks

Maintain separate tracks:

### Copy Track

Stores:

- Current Level
- Highest Level Reached
- Accuracy History

### Memory Track

Stores:

- Current Level
- Highest Level Reached
- Accuracy History

Progress in one track does not automatically advance the other.

## Error Handling

### Copy Mode

Immediate correction.

Incorrect selections are identified immediately.

### Memory Mode

Allow completion.

Evaluate the entire pattern after submission.

## Success Philosophy

Accuracy-first.

No countdown pressure after pattern display ends.

Learner may take time to reconstruct the pattern.

## Result Screen

Reuse standard NeuroBridge worksheet result screen.

Display:

- Questions
- Correct / Total
- Accuracy
- Time Taken
- Average Time
- Hints Used
- Mistakes Corrected

Buttons:

- Try Again
- Home

## Skill Mapping Metadata

Each level should support metadata describing:

### Domain

Visual Working Memory

### Skills

- Visual Encoding
- Spatial Mapping
- Visual Retention
- Pattern Reconstruction
- Color Recall

Future analytics and SIRAASH integrations will consume this metadata.

## Out of Scope

Do not:

- Implement gameplay
- Create UI
- Create parent dashboard screens
- Create analytics screens
- Create backlog items

Documentation only.
