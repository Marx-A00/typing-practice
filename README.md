# Typing Practice Application

A vanilla JavaScript application for practicing typing with support for DVORAK keyboard layout.

## Features

- Typing practice with WPM and accuracy tracking
- DVORAK keyboard layout support
- Dark mode
- Adjustable text size
- Visual keyboard with real-time key highlighting
- Responsive design

## Project Structure

```
/
├── index.html              # Main HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Project dependencies and scripts
├── README.md               # This file
├── src/                    # Source code
│   ├── main.js             # Main application entry point
│   ├── style.css           # Main stylesheet
│   ├── paragraphs.js       # Text data for typing practice
│   ├── assets/             # Static assets
│   │   └── keyboard-layout.svg  # SVG keyboard layout
│   ├── components/         # UI components
│   │   └── keyboard.js     # Keyboard component logic
│   └── utils/              # Utility functions
│       └── typing.js       # Typing-related utilities
└── public/                 # Public static assets
    └── vite.svg            # Favicon
```

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd typing-practice
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This will generate optimized files in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## License

MIT 