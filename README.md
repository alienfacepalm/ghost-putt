# GhostPutt - Ghost Ball Racing Mini Golf

A serverless P2P mini golf game featuring ghost ball racing and course evolution mechanics.

## Features

- **Ghost Ball Racing**: Real-time visualization of other players' shots
- **Course Evolution**: Players can place obstacles that affect all players
- **First-to-Hole Bonus**: Bonus points for completing holes first
- **AI-Generated Courses**: Procedurally generated 3-hole courses
- **WebRTC P2P**: No servers required, direct peer-to-peer connections
- **PWA Support**: Installable as a Progressive Web App
- **No Accounts**: Just enter a name and play

## Tech Stack

- React 18 + TypeScript
- Rspack (Rust-based bundler)
- Matter.js (Physics engine)
- WebRTC with simple-peer
- Zustand (State management)
- Tailwind CSS

## Getting Started

### Prerequisites

- nvm (Node Version Manager)
- pnpm

### Setup

1. **Install nvm** (if not already installed):

   - Windows: [nvm-windows](https://github.com/coreybutler/nvm-windows)
   - macOS/Linux: [nvm](https://github.com/nvm-sh/nvm)

2. **Install and use Node.js LTS**:

   ```bash
   nvm install --lts
   nvm use --lts
   ```

3. **Install pnpm** (if not already installed):

   ```bash
   npm install -g pnpm
   ```

4. **Install project dependencies**:
   ```bash
   pnpm install
   ```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
```

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # Business logic services
├── store/          # Zustand state stores
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── app.tsx         # Main app component
```

## License

MIT

# ghost-putt
