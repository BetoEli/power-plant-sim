# Power Plant Simulator Wireframe

This repository contains a static wireframe for **Project #2 – Nuclear Power Simulator**. The layout uses the required color palette (`#0b3953`, `#BFD7EA`, `#FF6663`, `#E0FF4F`, `#FFFFFE`) and the Roboto font from Google Fonts.

## How to view
Open `wireframe.html` in your browser. The page illustrates:
- Global dashboard controls and identity section
- Fleet summary metrics (temperature, output, coolant, rod positions)
- Global temperature chart placeholder and snackbar-style log list
- Reactor grid cards with per-reactor metrics, status chips, coolant state, rod counts, and controls for shutdown, restart, rods, coolant, and refueling
- Buttons for global emergency/controlled shutdown, coolant toggling, and plant reset

## Font
- **Roboto** (Google Fonts): included via `<link>` in `wireframe.html`.

## Notes
- The wireframe is designed for a SPA built with React, Material UI, and React Router. Cards and placeholders map to the API-driven requirements such as per-reactor charts, system logs, global reset, and control buttons.
