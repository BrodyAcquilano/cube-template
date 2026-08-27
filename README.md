# Cube Template

An experimental React / Three.js application template where **the cube is the navigation system**.

Instead of scrolling through a page or clicking links in a header, the user rotates around a six-sided cube. Each face can represent a different page, tool, visualization, story scene, dashboard, or interactive experience.

The template intentionally limits an application to **six primary faces**. That constraint is part of the design.

Rather than asking:

> How many pages should this application have?

the cube asks:

> What are the six things important enough to deserve a side?

This can be used as an unusual website interface, an interactive storytelling system, a visualization experiment, or simply a development sandbox for camera movement and lighting in Three.js.

---

## Concept

A normal website might be organized like this:

```text
Header

Home
About
Projects
Data
Settings
Contact
```

Cube Template replaces that navigation structure with:

```text
        TOP
         │
LEFT ─ FRONT ─ RIGHT
         │
       BOTTOM

        BACK
```

There are no traditional pages to scroll between.

The user physically rotates the view around the cube and lands on another face.

Every face can contain its own React component.

For example:

```text
Face 1 → Home
Face 2 → Projects
Face 3 → Data
Face 4 → About
Face 5 → Settings
Face 6 → Contact
```

Or the six faces could represent completely different concepts:

```text
Atmosphere
Ocean
Land
Ice
Fire
Night
```

The limitation to six major views is intentional. It encourages an application to be designed around a small number of strong ideas instead of an indefinitely expanding navigation tree.

---

# The Cube Does Not Actually Rotate

One of the main tricks in this template is that the cube itself remains stationary.

Instead, the **camera orbits around the cube**.

Because there is no fixed environmental background providing a strong frame of reference, moving the camera can create the illusion that the cube itself is rotating.

During normal mouse dragging, the directional light is also rotated by the same 3D transformation as the camera.

The result is approximately:

```text
User drags
    ↓
Camera orbits cube
    ↓
Directional light receives
the same relative rotation
    ↓
Cube appears to rotate
inside an orientationless space
```

The camera and light remain separate objects, but their relative relationship is preserved while rotating the viewport.

This illusion is one reason the application intentionally does not currently use a ground plane or physical background.

A ground, wall, or other fixed object would immediately establish a world coordinate system and make it obvious that the camera is moving instead of the cube.

---

# Face Snapping

The cube is not intended to stop at arbitrary angles during normal navigation.

When a mouse drag ends, the camera determines which cube face is closest and snaps directly toward that face.

The snap occurs in stages:

```text
Free rotation
    ↓
Nearest cube face detected
    ↓
Camera rotates to face normal
    ↓
Camera moves radially inward
    ↓
Camera roll aligns to a valid
quarter-turn orientation
    ↓
Face becomes active
```

This means the stable application states are the six cube faces.

An arbitrary diagonal view is useful while rotating, but it is not considered a normal resting page state.

The application therefore starts directly on **Face 1 / Front**, rather than beginning at an arbitrary angled camera position.

---

# Camera Orientation

Early versions of the project represented the camera primarily using spherical coordinates:

```text
radius
azimuth
vertical angle
```

Those values are still useful for describing position.

However, interaction around a cube requires another concept: **camera orientation**.

At any point the camera has three important local axes:

```text
Normal
    Direction from cube toward camera

Up
    Current screen-up direction

Right
    Current screen-right direction
```

Mouse dragging operates using these local axes rather than attempting to map every interaction directly onto global spherical coordinates.

This becomes particularly important on the top and bottom faces, where normal spherical azimuth behavior becomes ambiguous.

Using local 3D rotation axes allows the camera to move naturally away from any cube face.

---

# Cursor Modes

Cube Template includes an **Invert Cursor** toggle.

Both modes are valid because they describe two different mental models for interacting with the cube.

## Normal Cursor

With normal cursor movement, dragging can feel like selecting the direction you want to travel.

For example:

```text
Drag right
→ move toward the face on the right
```

This can feel appropriate for applications where the cube is fundamentally a navigation structure.

You are effectively saying:

> Take me in this direction.

---

## Inverted Cursor

With inverted cursor movement, the interaction feels more like physically spinning the cube.

For example:

```text
Drag right
→ cube appears to rotate left
```

This resembles transferring inertia into an object.

You move your hand in one direction and the cube appears to rotate away in the opposite direction.

For an application that wants the cube to feel like a physical object, inverted controls may feel more natural.

The toggle exists because neither interpretation is universally correct.

---

# Zoom

Mouse-wheel zoom changes the camera's radial distance from the cube.

Because the camera always looks toward the origin, zoom always moves toward or away from the cube itself.

Zoom is clamped so the camera cannot move through the cube.

Zooming outward can also break the camera out of its snapped state.

This allows the user to temporarily inspect the cube from farther away without immediately navigating to another face.

The intended interaction is approximately:

```text
Snapped face
    ↓
Zoom out
    ↓
Unsnap
    ↓
Free inspection
```

Mouse dragging remains navigation-oriented.

Once a drag completes, the normal face-snapping system takes control again.

---

# Orthographic Camera Controls

The development interface includes a set of custom camera controls built from **orthographic projections**.

Instead of using conventional orbit-control sliders, the application displays the camera's position as projections of the same 3D vector.

The camera controls appear in the lower-left corner.

They contain:

```text
        T
        │
        F ─ R
```

Where:

```text
T = Top projection
F = Front projection
R = Right projection
```

These are not independent camera positions.

They are three views of the same position.

Changing one projection updates the underlying 3D camera position, which means the other projections update automatically.

Conceptually:

```text
          Camera Position
                │
       ┌────────┼────────┐
       │        │        │
      Top     Front     Right
```

The controls can also alter camera radius, making them useful for inspecting the scene from distances outside the normal snapped navigation state.

Using the camera controls cancels the current snap so the camera can be manipulated freely.

---

# Orthographic Lighting Controls

The directional light has its own orthographic position controls in the lower-right corner.

Because the light controls live on the opposite side of the screen, their side projection is mirrored so the two interfaces fit naturally into their respective corners.

The lighting control layout is:

```text
Camera                      Lighting

    T                            T
    │                            │
    F ─ R                    L ─ F
```

The camera therefore uses a Right-side projection while the lighting interface uses a Left-side projection.

This is primarily a visual/UI decision.

The two controls represent the same type of underlying 3D concept but are intentionally mirrored to create a balanced interface.

---

# Independent Lighting

The directional light can be manipulated independently using its orthographic controls.

This means the developer can place the camera somewhere and then separately experiment with where the directional light originates.

However, viewport dragging behaves differently.

During normal mouse rotation:

```text
Camera rotation
      +
same relative light rotation
```

The directional light receives the same 3D rotational transformation as the camera.

This preserves the camera/light relationship while the user navigates around the cube.

So there are effectively two lighting behaviors:

```text
Lighting control
→ move light independently

Viewport drag
→ camera and light rotate together
```

---

# Lighting Controls

The development interface currently exposes:

```text
Ambient Intensity
Directional Intensity
Hue
Saturation
```

### Ambient Intensity

Controls the amount of general scene illumination.

### Directional Intensity

Controls the strength of the directional light.

### Hue

Controls the directional light's position on the color spectrum.

### Saturation

Controls how strongly colored the directional light is.

A saturation value near zero produces approximately white light regardless of hue.

The directional-light color is calculated using Three.js HSL color handling.

---

# Lighting Limitations

Lighting against the cube itself works normally.

Lighting the environment is intentionally limited.

A Three.js scene background color is not physical geometry, so it cannot:

```text
receive light
cast shadows
receive shadows
```

A ground plane was tested during development and correctly received the cube's shadow.

However, it introduced a larger problem.

A fixed ground plane establishes an obvious world orientation.

Once the viewer sees a floor, the illusion that the cube itself is rotating is lost because it becomes visually obvious that the camera is moving around a stationary object.

For this template, preserving the cube-navigation illusion is considered more important than environmental shadows.

Applications built from this template can make a different choice if their design benefits from a fixed 3D environment.

---

# Development Controls

All visual development controls are optional.

Runtime contains:

```js
showControls
setShowControls
```

Setting:

```js
showControls = false
```

removes the development controls from rendering.

This leaves the actual application experience:

```text
Cube
Camera interaction
Zoom
Drag
Snap
Faces
Lighting
```

without the debugging interface surrounding it.

The underlying camera and lighting state does not depend on the controls being mounted, so hiding the controls does not reset the application.

This makes the controls useful while designing the experience without requiring them in the final product.

For a normal website built using this template, a likely production configuration would simply disable them.

For a 3D modelling, lighting, visualization, or development application, they may remain useful as permanent tools.

---

# Interaction Hooks

The main interaction behavior is separated into React hooks.

## `useOrbitDrag`

Handles pointer-based rotation around the cube.

It:

- captures pointer movement,
- determines the camera's local rotational axes,
- rotates the camera using Three.js quaternions,
- applies the same relative rotation to the directional light,
- supports normal and inverted cursor behavior,
- transitions the runtime into dragging/free-rotation state.

The drag system works in true 3D rather than relying entirely on azimuth/elevation changes.

---

## `useCubeSnap`

Handles returning the camera to a valid cube-face state.

It:

- detects the nearest cube face,
- rotates the camera toward that face's normal,
- rotates the light by the same navigation correction,
- moves the camera radially inward,
- aligns the camera orientation to the nearest valid quarter turn,
- sets the active face,
- marks the runtime as snapped.

This is what converts free orbital movement into six discrete application pages.

---

## `useOrbitZoom`

Handles mouse-wheel camera distance.

It:

- zooms toward or away from the cube,
- clamps camera radius,
- prevents the camera from moving through the cube,
- breaks out of snap when zooming away,
- can return the camera to the snap system when appropriate.

---

# Runtime

`useCubeRuntime` is the central source of live application state.

It stores values such as:

```text
Camera position
Camera radius
Camera azimuth
Camera vertical angle
Camera up vector

Directional light position
Directional light radius
Directional light color
Directional light intensity

Ambient light intensity

Current face
Active face

Dragging state
Snapped state

Invert cursor
Show controls
```

Components render these values.

Hooks manipulate them.

This keeps the application architecture roughly separated into:

```text
Components
    ↓
render scene and controls

Hooks
    ↓
implement interactions

Runtime
    ↓
owns live application state
```

---

# Cube Faces

Each cube side is its own React component.

The current structure uses:

```text
Components/
└── Faces/
    ├── Face1.jsx
    ├── Face2.jsx
    ├── Face3.jsx
    ├── Face4.jsx
    ├── Face5.jsx
    └── Face6.jsx
```

The face components do not need to know where they physically exist in 3D.

`Cube.jsx` supplies their position and orientation.

Conceptually:

```text
Face Component
    ↓
content only

Cube.jsx
    ↓
position + rotation
```

This allows a face to focus entirely on being a page.

---

# Current Demo: The World's Least Necessary Adventure Game

The template currently contains an intentionally ridiculous choose-your-own-adventure experiment.

Face 1 begins with:

> Welcome to the Cube.

From there, the user encounters a collection of loosely connected situations involving things such as:

```text
a bus
a hot dog cart
twenty dollars
a street musician
pigeons
questionable decision making
```

Each face contains four possible responses corresponding to its four physical edges.

The important experiment is not really the story.

The purpose is to demonstrate that cube navigation can itself become part of an application's interaction model.

The six faces are treated as **situations rather than chapters**.

There does not need to be a canonical beginning-to-end sequence.

Instead:

```text
Situation
   ↓
Choice
   ↓
Another face
   ↓
Situation
   ↓
Choice
   ↓
Another face
```

Routes may loop.

Different paths can arrive at the same situation.

The narrative can remain deliberately ambiguous enough that several orders still make sense.

This could eventually be connected to an AI system that dynamically generates:

```text
situations
responses
routes
dialogue
events
```

allowing each trip around the cube to become a different procedural adventure.

For now, it serves as a proof of concept for interactive face content.

---

# Why Build an Application This Way?

Cube navigation is obviously not appropriate for every application.

That is part of the point.

It is a deliberate interface constraint.

This template may be useful for:

### Interactive websites

A portfolio, creative site, project showcase, exhibition, or experimental landing page where conventional navigation would feel too ordinary.

### Scientific visualization

Six related datasets or systems can occupy different faces of the cube.

For example:

```text
Atmosphere
Ocean
Land
Ice
Fire
Night
```

### System dashboards

A limited set of major operational categories could each occupy one side.

### Storytelling

Each face can represent a location, situation, character, event, or narrative state.

### Educational experiences

Different sides can explain different parts of a system while preserving their spatial relationship.

### 3D development

With the development controls enabled, the project can act as a lightweight sandbox for experimenting with:

```text
camera movement
quaternions
local rotational axes
lighting position
lighting color
orthographic projections
snap transitions
3D UI
```

---

# No Scrolling Required

One of the central ideas behind Cube Template is that an application does not necessarily need to grow vertically.

Traditional web applications frequently become:

```text
scroll
scroll
scroll
scroll
navigation
scroll
more content
scroll
```

This template intentionally explores another direction.

The application has a constrained spatial structure.

Instead of scrolling through content, the user changes **orientation**.

```text
Traditional site:
position on page

Cube site:
orientation in space
```

The cube therefore becomes both:

```text
navigation
and
interface
```

---

# Technology

Cube Template is built with:

```text
React
Vite
Three.js
React Three Fiber
Drei
```

React manages application state and components.

React Three Fiber provides React integration with Three.js.

Drei supplies useful Three.js helpers such as the perspective camera and 3D text.

Three.js provides the underlying vectors, colors, quaternions, geometry, lighting, and rendering system.

---

# Project Philosophy

Cube Template is intentionally small.

The goal is not to build a general-purpose 3D engine.

The goal is to provide a reusable foundation for applications where:

```text
six faces are enough
rotation replaces navigation
orientation replaces scrolling
```

The complexity belongs in whatever each face eventually becomes.

The cube itself should remain a simple navigation primitive:

```text
drag
rotate
snap
choose a face
interact
repeat
```

Development controls can remain visible while designing the application and disappear entirely when they are no longer needed.

At that point, all the user sees is the cube.