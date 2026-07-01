# NeuroBridge Learner Experience Constitution

## Purpose

This document defines the frozen V1 learner experience principles for NeuroBridge. It captures the experience rules discovered through Schulte, Directions, Number Bridges, and observation of Adarsh so future learner-facing activities stay calm, legible, and consistent.

## Principles

### 1. Recognition-Based Launcher

- **Decision**: Learners should choose from recognizable activity tiles rather than text-heavy menus or complex launch flows.
- **Why it matters**: Recognition reduces friction and helps learners start quickly without rereading long lists.
- **Example**: A tile with the activity name, simple visual identity, and clear tap target.
- **Platform implication**: Launcher surfaces should standardize on simple, recognizable activity tiles.

### 2. Learning Object Dominates

- **Decision**: The active learning object must be the dominant visual element on the screen.
- **Why it matters**: Learners should not have to search for the task among extra panels or decorative chrome.
- **Example**: A direction card grid or worksheet object centered and visually prioritized over surrounding UI.
- **Platform implication**: Platform layouts should reserve the largest share of visual weight for the current task.

### 3. Familiar Learning Frame

- **Decision**: Learners should see a stable frame around the task so the experience feels familiar across activities.
- **Why it matters**: Familiar structure lowers cognitive overhead and makes transfer between activities easier.
- **Example**: A consistent header, prompt area, activity surface, feedback frame, and completion surface.
- **Platform implication**: Shared shells should provide a repeatable frame instead of each activity inventing its own layout.

### 4. Calm High-Contrast Workspace

- **Decision**: Activity screens should use calm, high-contrast visuals with strong readability and restrained emphasis.
- **Why it matters**: Neurodivergent learners benefit from clear focus, low clutter, and easy scanning.
- **Example**: Readable prompt text on a light background with one focal area and minimal competing decoration.
- **Platform implication**: Design tokens and shared components should favor legibility and visual restraint.

### 5. Progressive Disclosure

- **Decision**: Show only the information needed for the current learner action.
- **Why it matters**: Too much visible structure can fragment attention and slow down decision-making.
- **Example**: Hint content appears only after the learner asks for help.
- **Platform implication**: Components should hide optional regions until they are relevant.

### 6. Activity-Owned Scaffolds

- **Decision**: Scaffold content belongs to the activity unless it has been promoted into a shared platform pattern.
- **Why it matters**: Activities have different support needs, and forcing a single scaffold shape too early can reduce clarity.
- **Example**: One activity uses an orange pulse on a wrong card while another uses a clue panel.
- **Platform implication**: The platform should expose scaffold slots and timing hooks, not hardcode every scaffold interaction.

### 7. Activity UI Families

- **Decision**: Activities should belong to explicit UI families when they share structure and behavior.
- **Why it matters**: Families make shared layout and component reuse intentional rather than accidental.
- **Example**: Worksheet-style activities share a common shell and completion pattern.
- **Platform implication**: Shared family contracts should define what is fixed and what remains activity-specific.

### 8. Feedback Timing Families

- **Decision**: Different activity families may need different feedback timing, but each family should be internally consistent.
- **Why it matters**: Some tasks need immediate validation while others need a short pause before feedback.
- **Example**: A direct selection activity flashes feedback immediately; a listening task may wait for a response window.
- **Platform implication**: The platform should support timing profiles rather than forcing one global feedback delay.

### 9. Executive Control Scaffolds

- **Decision**: Learners should be supported with control scaffolds that reduce planning load without removing agency.
- **Why it matters**: Clear controls help learners know what to do next and where to recover if they get stuck.
- **Example**: A consistent Home action, predictable Play Again action, and an obvious hint mechanism.
- **Platform implication**: Shared shells should own control placement and behavior.

### 10. Learner vs Parent Information Separation

- **Decision**: Learner-facing screens should not mix parent-oriented analytics, summaries, or explanations into the active learning view.
- **Why it matters**: Learners need a focused task surface; adult information can distract from learning.
- **Example**: A learner sees a completion surface, while detailed analytics stay in parent or reporting views.
- **Platform implication**: Platform surfaces must keep learner and parent information channels separate.

### 11. Audio Language

- **Decision**: Audio should use plain, consistent, learner-friendly language that matches the on-screen task.
- **Why it matters**: Spoken prompts and feedback should reinforce the same task signal the learner sees.
- **Example**: "Tap UP" paired with the same direction prompt on screen.
- **Platform implication**: Shared audio hooks should mirror the canonical prompt and feedback vocabulary.

### 12. Motion Language

- **Decision**: Motion should be purposeful, brief, and supportive of comprehension rather than decorative.
- **Why it matters**: Motion can help learners notice change, but too much motion competes with task focus.
- **Example**: A gentle orange pulse on a wrong selection instead of a disruptive animation.
- **Platform implication**: Motion patterns should be standardized and minimal.

### 13. Adaptive Timing

- **Decision**: Timing should adapt to learner context and activity family, not rely on a single rigid delay.
- **Why it matters**: Some learners need more time to register feedback or transition between states.
- **Example**: A completion surface remains visible until the learner explicitly chooses the next action.
- **Platform implication**: Transition APIs should accept timing profiles and preserve stable visibility rules.

### 14. Milestone Celebrations

- **Decision**: Celebrations should be milestone-based, intentional, and separated from routine feedback.
- **Why it matters**: Celebration is more meaningful when it marks real progress rather than every correct answer.
- **Example**: A level-up celebration shown after a meaningful milestone, not after each selection.
- **Platform implication**: Celebration behavior should live in a dedicated platform component and policy.

### 15. Calm Before Excitement

- **Decision**: The learner experience should stay calm during the task and reserve excitement for meaningful milestones.
- **Why it matters**: Overstimulating the learning surface reduces focus and makes tasks feel noisy.
- **Example**: A quiet completion surface with clear actions, rather than animated fireworks over the task area.
- **Platform implication**: Platform defaults should bias toward restraint, with excitement introduced only through explicit milestone components.

