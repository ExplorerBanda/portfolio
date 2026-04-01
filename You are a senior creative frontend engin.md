Refinement pass: Improve staging realism, lighting behavior, interaction quality, and visual hierarchy.

Current implementation works technically but needs artistic direction improvements so the stage feels professionally designed rather than technically arranged.

Fix the following issues:

--------------------------------------------------

1 PROJECTOR SCREEN POSITION (DEPTH FIX)

Problem:
Projector screen feels too close and not clearly part of the stage background.

Fix:

Move projector screen to the BACK of the stage using proper depth positioning.

Requirements:

• Place behind all main props
• Slightly elevated like theatre backdrop screen
• Should visually connect with curtain/backdrop
• Slightly increase scale to simulate distance
• Optional subtle back lighting glow

Implementation direction:

Place screen deeper on Z axis than all props.
Suggested range:
Z between -6 and -10 depending on scene scale.

Goal:
Clear visual background layer.

--------------------------------------------------

2 LIGHTING LOGIC IMPROVEMENT

Problem:
Scene lighting is too uniform. Real theatres keep environment dark and stage readable.

Target behavior:

• Environment dim
• Stage readable but not bright
• Spotlight becomes main focus light
• Background darker
• Balcony almost dark

Implementation changes:

Reduce ambient light intensity:
0.05–0.12 range.

Add soft stage fill light instead of global lighting.

Use directional or area light focused only on stage.

Goal:

User should explore stage with spotlight, not see everything clearly without it.

--------------------------------------------------

3 SPOTLIGHT MOVEMENT CONSTRAINT

Problem:
Spotlight moves outside stage.

Target:

Spotlight only moves on stage surface.

Implementation:

Clamp spotlight X position within stage width.
Clamp spotlight Z within stage depth.

Example logic:

Define:

stageWidthMin
stageWidthMax
stageDepthMin
stageDepthMax

Clamp projected mouse coordinates.

Spotlight must never illuminate balcony or empty space.

Goal:

Spotlight behaves like real theatre lighting.

--------------------------------------------------

4 CURSOR EXPERIENCE IMPROVEMENT

Problem:
Cursor movement feels jittery and distracting.

Improve:

• Smooth interpolation (lerp)
• Reduce jitter
• Slight motion delay
• Remove default cursor
• Replace with subtle theatre cursor

Implementation suggestions:

Use smoothing factor:
0.05–0.12

Throttle updates to ~60fps.

Optional improvements:

Small golden glow near hotspot.
Soft fade edge.

Goal:

Cursor should feel cinematic and smooth.

--------------------------------------------------

5 STAGE PROP BLOCKING (IMPORTANT)

Problem:
Props feel randomly placed instead of staged.

Fix using theatre blocking principles:

Center:
Main identity prop

Left:
Technical props (laptop, ML screen)

Right:
Leadership / stage props

Back:
Projection screen

Front:
Contact interaction prop

Spacing:

• Maintain clear spacing
• Avoid silhouette overlap
• Slight arc layout feels natural
• Use Z staggering for depth layers

Example structure:

Front layer:
Contact prop

Middle layer:
Main props

Back layer:
Projection screen

Goal:

Intentional composition.

--------------------------------------------------

6 SCALE REALISM IMPROVEMENT (ART DIRECTOR FIX)

Problem:
Props may feel same scale which breaks realism.

Fix:

Ensure believable relative size:

Projection screen → largest background object
Chair → medium
Laptop → small-mid
Microphone → small focal prop

Rules:

No props same scale.
Respect real world proportions.

Goal:

Improve physical believability.

--------------------------------------------------

7 VISUAL HIERARCHY (STAGE ART DIRECTOR PASS)

Improve how users visually explore stage.

Apply visual hierarchy:

Primary focus:
Center prop slightly brighter.

Secondary props:
Slightly dimmer.

Tertiary props:
More subtle.

Optional techniques:

Slight spotlight intensity boost on hover.
Very subtle hover lift animation.
Soft shadow grounding.

Goal:

User naturally explores in meaningful order.

--------------------------------------------------

8 OPTIONAL POLISH (ONLY IF SIMPLE)

Add:

Soft shadow under props.
Subtle hover elevation.
Slight spotlight intensity boost on hover.
Very subtle depth fog tuning.

Avoid excessive animation.

--------------------------------------------------

OUTPUT FORMAT:

SECTION 1 Updated positioning strategy
SECTION 2 Updated lighting values
SECTION 3 Spotlight constraint implementation
SECTION 4 Cursor smoothing implementation
SECTION 5 Updated prop coordinates
SECTION 6 Scale corrections
SECTION 7 Visual hierarchy improvements
SECTION 8 Updated code snippets only

IMPORTANT:

Do NOT redesign architecture.
Do NOT rewrite systems.
Only refine staging, realism, and interaction polish.

Goal:

Make the scene feel like a professionally directed theatre stage instead of a technical 3D layout.