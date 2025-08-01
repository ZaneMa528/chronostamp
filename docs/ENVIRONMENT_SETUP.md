# ChronoStamp Protocol - Environment Variables Setup Guide

This document provides detailed instructions for setting up all required environment variables for the ChronoStamp Protocol frontend application.

## Quick Start

1.  **Copy the environment template**:

    ```bash
    cp .env.example .env
    ```

2.  **Populate `.env`**: Follow the detailed setup instructions below for each service to fill in the necessary values in your new `.env` file.

---

## Required Environment Variables

This section covers the essential variables needed to run the application locally.

### 1. Database Configuration (Turso - LibSQL)

ChronoStamp uses Turso for a scalable, SQLite-compatible database. The application automatically switches between development and production databases based on the `NODE_ENV`.

**Variables:**

- `DATABASE_URL_DEV`
- `DATABASE_AUTH_TOKEN_DEV`

**Setup Instructions:**

1.  **Install Turso CLI**:
    ```bash
    curl -sSfL https://get.tur.so/install.sh | bash
    ```
2.  **Sign up or log in**:
    ```bash
    turso auth signup
    ```
3.  **Create a development database**:
    ```bash
    turso db create chronostamp-dev
    ```
4.  **Get the database URL**:
    ```bash
    turso db show chronostamp-dev
    ```
    Copy the "URL" value.
5.  **Create an authentication token**:
    ```bash
    turso db tokens create chronostamp-dev
    ```
    Copy the generated token.

### 2. IPFS Storage Service (Pinata)

IPFS is used for decentralized storage of NFT metadata and artwork. Pinata provides a reliable gateway and pinning service.

**Variable:**

- `PINATA_JWT`

**Setup Instructions:**

1.  **Create a Pinata account**: Go to [app.pinata.cloud](https://app.pinata.cloud/).
2.  **Generate an API Key**:
    - Navigate to the **API Keys** section.
    - Click **New Key**.
    - Grant the following permissions: `pinFileToIPFS`, `pinJSONToIPFS`.
    - Copy the generated **JWT (JSON Web Token)**.

### 3. Cryptographic Signature Service

The application uses a server-side private key to generate cryptographic signatures for authorizing NFT claims. This off-chain proof is verified by the on-chain smart contract.

**Variables:**

- `SIGNER_PRIVATE_KEY_DEV`
- `NEXT_PUBLIC_SIGNER_ADDRESS_DEV`

**Setup Instructions:**

1.  **Generate a private key**:
    ```bash
    openssl rand -hex 32
    ```
2.  **Format the private key**: Add `0x` to the beginning of the generated string. This is your `SIGNER_PRIVATE_KEY_DEV`.
3.  **Derive the public address**: Use a tool like MetaMask or a simple script to get the public address corresponding to your new private key. This is your `NEXT_PUBLIC_SIGNER_ADDRESS_DEV`.

> **Security Warning**: NEVER use development keys in a production environment. Always generate separate, securely stored keys for production.

### 4. Smart Contract Configuration

This variable points to the deployed factory contract that is responsible for creating new ChronoStamp event contracts.

**Variable:**

- `NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS`

**Setup Instructions:**

- For local development, you can use the address provided in the `.env.example` file, which points to the factory contract on the Arbitrum Sepolia testnet.

---

## Optional & Production Variables

This section covers variables that are optional for local development but required for a full production deployment.

### Production Database

**Variables:**

- `DATABASE_URL_PROD`
- `DATABASE_AUTH_TOKEN_PROD`

**Setup Instructions:**

- Follow the same steps as the development database, but create a new database (e.g., `chronostamp-prod`) and a corresponding token.

### Production Signer

**Variables:**

- `SIGNER_PRIVATE_KEY_PROD`
- `NEXT_PUBLIC_SIGNER_ADDRESS_PROD`

**Setup Instructions:**

- Generate a new, secure keypair exclusively for your production environment. Follow the same steps as for the development keys.

### Custom RPC Endpoint

**Variable:**

- `RPC_URL`

**Setup Instructions:**

- The application uses default public RPCs if this is not set. For better reliability and performance in production, provide a custom RPC URL from a provider like Alchemy or Infura for the Arbitrum Sepolia network.

---

## Final Check

After populating your `.env` file, ensure:

- All required variables for your environment (`_DEV` for local) are filled.
- Keys and addresses are prefixed with `0x`.
- There are no extra spaces or characters in the values.
- The `.env` file is listed in your `.gitignore` and will never be committed.
