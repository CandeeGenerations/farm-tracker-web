# Farm Tracker

[![Validate Branch](https://github.com/CandeeGenerations/farm-tracker-web/actions/workflows/validate-branch.yaml/badge.svg)](https://github.com/CandeeGenerations/farm-tracker-web/actions/workflows/validate-branch.yaml)

Track your farm!

## Getting Started

### Prerequisites

- Node.js 22.x
- PNPM 10.x
- [phase.dev](https://docs.phase.dev/quickstart#2-install-the-cli)

### Local Setup

1. Check if you have corepack:
   ```sh
   corepack -v
   ```
1. If not, install it:
   ```sh
   brew install corepack
   ```
1. Enable pnpm
   ```sh
   corepack enable pnpm
   ```
1. Install pnpm
   ```sh
   corepack use pnpm
   ```
1. Install project dependencies
   ```sh
   pnpm run install:all
   ```
1. Configure phase.dev:
   ```sh
   cd client
   phase init
   cd ../server
   phase init
   ```
1. Start the client:
   ```sh
   cd client
   pnpm run dev
   ```
1. Start the server:
   ```sh
   cd server
   pnpm run start
   ```
