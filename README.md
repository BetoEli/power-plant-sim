# Nuclear Power Simulator ⚡

**Course**: Advanced Web Programming  
**Date**: December 17, 2025  
**Last Edit**: Complete implementation of Nuclear Power Simulator meeting all project requirements

A React + TypeScript single-page application (SPA) for monitoring and controlling virtual nuclear power plant reactors in real-time.

## Features

### Dashboard (Global View)

- View all reactors in 2x2 grid layout
- Global average temperature display and 5-minute history chart
- Total power output in megawatts
- Active reactor count
- **Global Controls**:
  - Enable/Disable all coolant systems
  - Controlled shutdown all reactors
  - Emergency shutdown all reactors
  - System reset button
- System logs showing all events from all reactors

### Per Reactor

- Individual temperature with 5-minute history chart
- Temperature status (safe/warning/danger/meltdown)
- Coolant state (on/off) with toggle
- Power output in MW
- Fuel level percentage
- Reactor state (online/offline/maintenance/shutdown)
- Rod state (count in/out)
- Control buttons: Raise Rod, Drop Rod, Toggle Coolant, Start, Controlled Shutdown, Emergency Shutdown, Maintenance, Refuel
- Customizable reactor names (persisted)
- **Details Modal**: Full reactor view with all controls and complete activity logs

### Additional Features

- **Customizable Plant Name**: Click to edit, persisted to localStorage and server
- **Temperature Unit Toggle**: Switch between Fahrenheit and Celsius (°F/°C)
- **Toast Notifications**: Success/error messages using Notistack
- **Real-time Polling**: Automatic data refresh every 3-5 seconds
- **Data Persistence**: Names and preferences saved across sessions

## Tech Stack

- **React 19** with TypeScript
- **Vite 7.2.7** for build tooling and dev server
- **Material UI v7** (@mui/material) for buttons and UI components
- **Recharts 3.6.0** for temperature line charts with axes and tooltips
- **Notistack 3.0.2** for toast notifications
- **React Router v7.10.1** for SPA routing architecture
- **Fetch API** for HTTP requests to nuclear.dacoder.io
- **CSS** for custom styling
- **Google Font**: **Roboto Condensed** (sans-serif, weights: 400, 600, 700)

## Color Palette (Project Requirement)

- Primary: `#0b3954` (Deep Blue)
- Light: `#BFD7EA` (Light Blue)
- Secondary: `#E0FF4F` (Yellow-Green)
- Error: `#FF6663` (Red)
- Background: `#1a1a1a` (Dark Gray)

## Dependencies (Explicitly Added)

### Production Dependencies:

1. **@mui/material (v7.3.6)** - Material UI component library for buttons, modals, and UI elements as required by project specifications
2. **@emotion/react & @emotion/styled** - Required peer dependencies for Material UI styling
3. **recharts (v3.6.0)** - Professional charting library for temperature history line charts with axes, tooltips, and responsive design
4. **notistack (v3.0.2)** - Toast notification system for displaying server messages as snack logs (project requirement)
5. **react-router-dom (v7.10.1)** - SPA routing library as explicitly required by project specifications

Note: React 19, Vite, and TypeScript come with the default Vite React template.

## API Integration

All data consumed from: `https://nuclear.dacoder.io/`

- API Key: `643dbd98e1b2adde` (query parameter)
- All endpoints from `/api` documentation are implemented
- Polling intervals: 3-5 seconds for real-time updates

## Getting Started

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

```bash
npm install
# or
yarn install
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

### Build for Production

```bash
npm run build
# or
yarn build
```

## API Integration

All API endpoints are integrated via `src/api/reactors.api.ts`:

- **GET /reactors** - List all reactors and plant info
- **GET/POST /reactors/temperature** - Temperature data and unit switching
- **GET/POST /reactors/coolant/{id}** - Coolant state management
- **GET /reactors/output/{id}** - Power output data
- **GET /reactors/fuel-level/{id}** - Fuel level monitoring
- **GET /reactors/reactor-state/{id}** - Reactor operational state
- **GET /reactors/rod-state/{id}** - Control rod positions
- **POST /reactors/drop-rod/{id}** - Lower control rods
- **POST /reactors/raise-rod/{id}** - Raise control rods
- **POST /reactors/emergency-shutdown/{id}** - Emergency shutdown
- **POST /reactors/controlled-shutdown/{id}** - Controlled shutdown
- **POST /reactors/start-reactor/{id}** - Start reactor
- **POST /reactors/maintenance/{id}** - Maintenance mode
- **POST /reactors/refuel/{id}** - Refuel reactor
- **POST /reactors/reset** - Global reset
- **PUT /reactors/plant-name** - Update plant name
- **PUT /reactors/set-reactor-name/{id}** - Update reactor name
- **GET /reactors/logs** - System logs

## Project Structure

```
src/
├── api/              # API client and endpoint functions
├── app/              # App configuration (routes, theme, polling)
├── components/       # Reusable UI components
│   └── Charts/       # Chart components
├── pages/            # Page components
└── state/            # State management and localStorage utilities
```

## localStorage Persistence

The app persists the following to localStorage:

- Temperature unit preference (°F/°C)
- Plant name
- Reactor custom names

## License

MIT

---

**Google Font Used**: Roboto Condensed
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
