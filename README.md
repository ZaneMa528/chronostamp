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

- **Framework**: Next.js with TypeScript
- **Web3 Libraries**:
  - Ethers.js for smart contract interactions
  - RainbowKit for wallet connections
- **Styling**: Tailwind CSS
- **Database**: Drizzle ORM
- **Storage**: IPFS via Pinata
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chronostamp-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Homepage
│   └── layout.tsx      # Root layout
├── server/            # Database configuration and schemas
└── styles/            # Global styles and Tailwind CSS
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

------

**Built with ❤️ for the decentralized future of digital memory**
