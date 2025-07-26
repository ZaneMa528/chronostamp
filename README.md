# ChronoStamp Protocol - Frontend Application

A Next.js-based decentralized application (DApp) for creating and claiming ChronoStamp NFTs - permanent, verifiable digital artifacts of life experiences.

## 🌟 Overview

ChronoStamp transforms ephemeral life experiences into permanent, verifiable, and user-owned digital artifacts. This frontend application will serve as the primary interface for both Event Organizers and Attendees, providing a seamless Web3 experience for creating and claiming Proof of Attendance Protocol (POAP) tokens.

## 🏗️ Architecture

This application will combine a client-side user interface with a lightweight, secure backend API:

- **Frontend (React/Next.js)**: User-friendly UI for wallet connections, event creation, and stamp claiming
- **API Routes (Serverless Functions)**: Trusted off-chain oracle for signature generation
- **Web3 Integration**: Client-side blockchain interactions using Ethers.js
- **IPFS Storage**: Decentralized storage for artwork and metadata

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript and App Router
- **Database**: Turso (LibSQL) with Drizzle ORM - dual environment setup
- **Web3 Libraries**:
  - Ethers.js for smart contract interactions
  - RainbowKit + Wagmi for wallet connections
- **Styling**: Tailwind CSS v4
- **Storage**: IPFS via Pinata
- **State Management**: Zustand
- **Environment**: T3 env validation with Zod
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Turso CLI (for database management)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chronostamp
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration:
   # - Turso database URLs and tokens
   # - Pinata JWT for IPFS
   # - Signer private keys
   ```

4. **Database setup**

   ```bash
   # Push schema to database
   pnpm db:push
   
   # Insert demo data
   pnpm db:seed
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages and API routes
│   ├── api/            # API endpoints (IPFS, signatures, events, claims)
│   ├── create/         # Event creation page
│   ├── event/[id]/     # Event details and claiming page
│   ├── profile/        # User profile and NFT collection
│   ├── page.tsx        # Homepage
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components (Button, Card, etc.)
│   ├── layout/        # Layout components (Header, Footer)
│   ├── sections/      # Page sections (HeroSection, etc.)
│   ├── forms/         # Form components (CreateEventForm, etc.)
│   └── web3/          # Web3-specific components
├── lib/               # Utility functions and helpers
├── server/            # Database configuration and schemas
│   └── db/           # Drizzle ORM setup and schema definitions
├── stores/            # Zustand state management
├── providers/         # React context providers
└── styles/            # Global styles and Tailwind CSS
```

## 🗄️ Database Commands

```bash
# Schema management
pnpm db:generate        # Generate Drizzle migrations
pnpm db:push           # Push schema to database
pnpm db:studio         # Open Drizzle Studio

# Data management
pnpm db:seed           # Insert demo data (development)
pnpm db:seed:prod      # Insert demo data (production)
```

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the ChronoStamp Protocol. See the main repository for license details.

## 🔗 Related Repositories

- **Smart Contracts**: `chronostamp-contracts` - Contains all Solidity smart contracts and deployment scripts

---

**Built with ❤️ for the decentralized future of digital memory**
