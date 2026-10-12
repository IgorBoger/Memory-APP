# Memory-APP

A browser-based memory game for two players, developed as part of the Developer Akademie course. Players compete on the same device to find as many matching card pairs as possible.

## Features

- Four themes with matching card designs: **Code vibes**, **Gaming**, **DA projects**, and **Foods**.
- Three board sizes: **16, 24, or 36 cards**.
- Choose the starting player: **Blue** or **Orange**.
- Randomly shuffled cards, a current-player indicator, and score tracking.
- Results screens for a win or a draw.
- A confirmation dialog when leaving an active game.
- Responsive layouts and theme previews in the settings.

## How to Play

1. Click **Play** and select a theme, a starting player, and a board size.
2. Start the game and reveal two cards.
3. If the cards match, you earn one point and take another turn.
4. If the cards do not match, they are turned face down again and the other player takes their turn.
5. Once all pairs have been found, the player with the most points wins. Equal scores result in a draw.

## Technologies

- **TypeScript** for game logic and the user interface
- **HTML** and **SCSS** for structure and styling
- **Vite** for the development server and production builds

## Getting Started

Requirements: **Node.js 20.19+ within version 20, or Node.js 22.12 and later**, plus npm, as required by the project's Vite dependency.

Open a terminal in the project directory and install the dependencies:

```sh
npm ci
```

Start the development server:

```sh
npm run dev
```

Open the address shown in the terminal. With the default port, the application is available at `http://localhost:5173/memory/`.

## Build and Preview

```sh
npm run build
```

The build first checks TypeScript types, then generates the production application in the `dist/` directory.

To preview the production build locally:

```sh
npm run preview
```

Open the preview address shown in the terminal using the `/memory/` path.

## Project Structure

```text
Memory-APP/
├── public/
│   ├── fonts/          # Local fonts
│   └── img/            # Card designs and graphics
├── src/
│   ├── game/           # Cards, game flow, and timers
│   ├── styles/         # SCSS for pages and components
│   ├── templates/      # Card HTML template
│   ├── ui/             # Settings, navigation, and results
│   ├── app-context.ts  # Shared game state
│   ├── card-data.ts    # Card motifs for each theme
│   ├── main.ts         # Entry point
│   ├── theme-data.ts   # Theme data
│   └── types.ts        # TypeScript types
├── index.html
├── package.json
└── vite.config.ts
```

## Deployment

The application uses the **`/memory/`** base path configured in `vite.config.ts`. When deploying, serve the contents of `dist/` at that path. To deploy at a different path, update `base` and rebuild the application. This also applies to GitHub Pages if the repository path differs from `/memory/`.
