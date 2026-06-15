# Layout Standards

Purpose: Define common layout regions, device targets, and responsive rules for future NeuroBridge activities.

## Primary Design Target

Primary target: Tablet Landscape.

Reason:

- Tablets are likely to be the primary learner device.
- Landscape layout gives enough room for activity content and large touch targets.
- The same structure can scale down to phones and up to laptops.

## Device Targets

### Phone

Phone layouts should:

- Stack regions vertically.
- Keep answer controls reachable.
- Avoid horizontal scrolling.
- Preserve large touch targets.

### Tablet

Tablet layouts should:

- Prioritize centered activity content.
- Use large answer controls.
- Keep Need Help visible but out of the answer path.
- Support both portrait and landscape where possible.

### Laptop

Laptop layouts should:

- Avoid stretching learner content too wide.
- Use parent mode space for configuration and summaries.
- Preserve the same learner activity rhythm as tablet.

## Layout Regions

### Header

Contains stable activity context.

May include:

- SIRAASH learner identity.
- Home navigation.
- Activity name.
- Parent or sandbox mode marker.
- Minimal navigation.
- Compact progress.

Should not dominate the learner screen.

Rules:

- Avoid duplicate activity labels.
- Avoid a separate learner navigation row when navigation can live in the activity shell header.
- Keep learner-facing navigation wording simple, such as `Home`.

### Progress Area

Shows simple progress through the current session.

May include:

- Trial count.
- Step count.
- Minimal progress bar.

Avoid distracting score displays during problem solving.

### Content Area

Primary task surface.

Examples:

- Visual comparison objects.
- Matrix grid.
- Matching items.
- Ordering sequence.
- Worksheet prompt.

This should be the most visually important learner region.

### Answer Area

Primary response controls.

Rules:

- Place below or near the content area.
- Keep clear spacing from task content.
- Prevent overlap with object cards or worksheets.
- Keep controls large and equal where possible.

### Need Help Area

Reserved space for help entry and scaffold display.

Rules:

- Do not place help between instruction and answer choices.
- Keep help accessible.
- Keep scaffold content calm and brief.

### Feedback Area

Shows result feedback after a learner response.

Rules:

- Keep feedback short.
- Use clear success and retry states.
- Avoid visual overload.

### Footer

Optional lower region for session controls or parent handoff.

Learner activities may omit footer content if it adds noise.

## Layout Rules

### Mobile First

Design the smallest usable layout first, then enhance for tablet and laptop.

### Touch First

All primary controls must support confident touch input.

Minimum touch target:

- 44px x 44px

Preferred touch target:

- 56px or larger

### Responsive

Layouts should adapt to screen size without changing the activity meaning.

Rules:

- Avoid fixed widths that break on phones.
- Use stable content regions.
- Keep learner task and answer controls visible.
- Give the activity content region the maximum available space after header, answer, help, and feedback needs are met.

### No Hover Dependency

Hover states may improve laptop use, but no essential action, instruction, or scaffold may depend on hover.

Learners must be able to complete activities using touch alone.
