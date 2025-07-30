# ChronoStamp Protocol - Frontend Application

A Next.js-based decentralized application (DApp) for creating and claiming ChronoStamp NFTs - permanent, verifiable digital artifacts of life experiences.

## 🌟 Overview

ChronoStamp transforms ephemeral life experiences into permanent, verifiable, and user-owned digital artifacts. This production-ready frontend application serves as the primary interface for both Event Organizers and Attendees, providing a seamless Web3 experience for creating and claiming Proof of Attendance Protocol (POAP) tokens.

### ✨ Key Features

- **🎯 Event Creation**: Deploy smart contracts and create events with custom metadata
- **🎟️ NFT Claiming**: Real blockchain-based claiming with signature verification
- **🖼️ IPFS Integration**: Decentralized storage for artwork and metadata via Pinata
- **💼 User Profiles**: Personal NFT collections and event management
- **🔗 Web3 Wallet Support**: Seamless wallet connection with RainbowKit
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **⚡ Real-time Updates**: Dynamic UI updates and transaction tracking

## 🏗️ Architecture

This production application combines a modern React frontend with secure serverless backend APIs:

- **Frontend (Next.js 15)**: Production-ready UI with wallet connections, event creation, and NFT claiming
- **API Routes (Serverless Functions)**: Secure off-chain oracle for cryptographic signature generation
- **Web3 Integration**: Direct blockchain interactions using Ethers.js and dynamic contract deployment
- **IPFS Storage**: Decentralized metadata and artwork storage via Pinata Gateway
- **Database**: Turso (LibSQL) for hybrid on-chain/off-chain data management
- **Smart Contracts**: Deployed on Arbitrum Sepolia testnet for scalable NFT minting

### 🔄 Claim Flow

1. **Signature Generation**: Server generates cryptographic proof for eligible claims
2. **Wallet Verification**: Client-side wallet connection and address verification  
3. **Smart Contract Call**: Direct blockchain interaction for NFT minting
4. **Transaction Recording**: Hybrid storage of on-chain transaction data

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript and App Router
- **Database**: Turso (LibSQL) with Drizzle ORM - dual environment setup (dev/prod)
- **Web3 Libraries**:
  - Ethers.js v6 for smart contract interactions and dynamic imports
  - RainbowKit + Wagmi for wallet connections and chain management
  - Dynamic contract deployment and interaction
- **Styling**: Tailwind CSS v4 with custom components and responsive design
- **Storage**: IPFS via Pinata with gateway URLs and metadata management
- **State Management**: Zustand with persistent storage and notifications
- **Environment**: T3 env validation with Zod schemas and dual-environment support
- **Blockchain**: Arbitrum Sepolia testnet for development and testing
- **Deployment**: Vercel with serverless functions and edge optimization

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

## ⚡ Development Commands

### Core Development
```bash
pnpm dev              # Start development server with hot reload
pnpm build            # Build production application
pnpm start            # Start production server
pnpm preview          # Build and start (test production locally)
```

### Code Quality & Validation
```bash
pnpm lint             # Run ESLint linting
pnpm lint:fix         # Run ESLint with auto-fix
pnpm typecheck        # Run TypeScript type checking
pnpm check            # Run both lint and typecheck (comprehensive validation)
pnpm format:check     # Check Prettier formatting
pnpm format:write     # Apply Prettier formatting
```

### Database Management
```bash
# Schema management
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Apply migrations to database
pnpm db:push          # Push schema changes directly (development)
pnpm db:studio        # Open Drizzle Studio for database management

# Data management
pnpm db:seed          # Insert demo data (development environment)
pnpm db:seed:prod     # Insert demo data (production environment)
```

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the ChronoStamp Protocol. See the main repository for license details.

## 🌐 Live Demo & Testing

### Demo Events Available
The application includes pre-configured demo events for testing:

- **DevConf 2025** (Code: `DEVCONF2025`) - Developer conference NFT
- **Birthday Party** (Code: `BDAY2025`) - Personal celebration NFT  
- **Graduation** (Code: `MILESTONE2025`) - Achievement milestone NFT

### Web3 Integration
- **Network**: Arbitrum Sepolia Testnet
- **Block Explorer**: [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io/)
- **Testnet Faucet**: Get testnet ETH for gas fees

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# Database (Turso)
DATABASE_URL_DEV=             # Development database URL
DATABASE_AUTH_TOKEN_DEV=      # Development database auth token
DATABASE_URL_PROD=            # Production database URL  
DATABASE_AUTH_TOKEN_PROD=     # Production database auth token

# IPFS Storage (Pinata)
PINATA_JWT=                   # Pinata JWT for IPFS uploads

# Cryptographic Signing (Dual Environment)
SIGNER_PRIVATE_KEY_DEV=       # Development signing private key
NEXT_PUBLIC_SIGNER_ADDRESS_DEV= # Development signer public address
SIGNER_PRIVATE_KEY_PROD=      # Production signing private key
NEXT_PUBLIC_SIGNER_ADDRESS_PROD= # Production signer public address
```

## 🔗 Related Repositories

- **Smart Contracts**: [chronostamp-contract](https://github.com/ZaneMa528/chronostamp-contract) - Solidity smart contracts and deployment infrastructure
- **Documentation**: Project documentation and technical specifications

## 🏆 Production Status

✅ **Event Creation**: Full smart contract deployment and metadata upload  
✅ **NFT Claiming**: Real blockchain transactions with signature verification  
✅ **IPFS Integration**: Decentralized storage with Pinata gateway  
✅ **Database Management**: Hybrid on-chain/off-chain data persistence  
✅ **Web3 Wallet Support**: Multi-wallet connection with RainbowKit  
✅ **Responsive Design**: Mobile-optimized user experience  
✅ **Type Safety**: Full TypeScript coverage with strict validation  

---

**🚀 Built for the decentralized future of digital memory and verifiable experiences**
