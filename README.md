# 🐜 Crypto Ants DApp

> A retro-style blockchain strategy game where you build and manage your ant colony on Ethereum Sepolia testnet.

## 🎮 About

**Crypto Ants** is an interactive Web3 game that combines NFTs (ERC721) and fungible tokens (ERC20) to create an engaging blockchain gaming experience. Players buy eggs, hatch ants, and manage their colony with strategic decisions involving risk and reward.

This is the frontend application for the [Crypto Ants Challenge](../README.md) - a DeFi Wonderland security challenge that has been successfully completed with all vulnerabilities fixed and contracts audited.

## ✨ Features

### 🛒 Market System
- Buy eggs with ETH (0.01 ETH per egg)
- Dynamic pricing controlled by governance
- Real-time balance tracking

### 🐣 Ant Creation
- Hatch eggs to create unique NFT ants
- Each ant has its own metadata and visual representation
- Deterministic pastel color generation per ant

### 🏰 Colony Management
- View your entire ant collection
- Real-time status updates (alive/dead/sold)
- Track individual ant statistics

### 🥚 Egg Laying Mechanism
- Ants can lay eggs every 10 minutes (cooldown period)
- Random egg generation (0-20 eggs per lay)
- 10% chance of death when laying eggs
- Visual countdown timer for cooldown status

### 💰 Ant Trading
- Sell ants for 0.004 ETH
- Instant transaction processing
- Automatic balance updates

### 🎯 User Experience
- Interactive tutorial system (first-time users)
- Confetti celebrations on successful transactions
- Real-time event listening and UI updates
- Responsive design with retro-pixel aesthetic
- Global colony view (see all users' ants)

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 14** - React framework for production
- **React 18** - UI library
- **TypeScript** - Type-safe development

### Web3 Integration
- **RainbowKit** - Wallet connection UI
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript interface for Ethereum
- **TanStack Query** - Data fetching and caching

### UI/UX
- **React Joyride** - Interactive tutorial system
- **Canvas Confetti** - Celebration effects
- **CSS Modules** - Scoped styling

## 🎲 How to Play

1. **Connect Wallet** - Use RainbowKit to connect your Ethereum wallet
2. **Buy Eggs** - Purchase eggs from the market using ETH
3. **Hatch Ants** - Use eggs to create NFT ants in the nursery
4. **Manage Colony** - Your ants can:
   - Lay eggs (cooldown: 10 minutes, risk: 10% death chance)
   - Be sold for ETH
5. **Build Your Empire** - Strategically grow your colony!

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- MetaMask or compatible Ethereum wallet
- Sepolia testnet ETH ([get from faucet](https://sepolia-faucet.pk910.de/))

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type checking
pnpm typecheck
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here if needed
# The app uses public RPC endpoints by default
```

## 📁 Project Structure

```
dapp/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── AntIcon.tsx   # SVG ant visualization
│   │   └── EggIcon.tsx   # SVG egg visualization
│   ├── contracts/        # Smart contract ABIs and addresses
│   │   └── abis.ts       # CryptoAnts & Egg contract interfaces
│   ├── pages/            # Next.js pages
│   │   ├── _app.tsx      # App configuration with wagmi/RainbowKit
│   │   └── index.tsx     # Main game interface
│   └── styles/           # Global styles
├── public/               # Static assets
└── package.json
```

## 🔗 Deployed Contracts

### ✅ Audited & Secure (USE THESE)

| Contract | Address | Network |
|----------|---------|---------|
| **CryptoAnts (ERC721)** | [`0x314A85646A7676d0Ad683013F6a835E0E5F522aA`](https://sepolia.etherscan.io/address/0x314a85646a7676d0ad683013f6a835e0e5f522aa) | Sepolia |
| **Egg (ERC20)** | [`0x9b9f9965F2C3a8E4870B532d972634F7FC3D73A2`](https://sepolia.etherscan.io/address/0x9b9f9965f2c3a8e4870b532d972634f7fc3d73a2) | Sepolia |

### ⚠️ Deprecated Contracts (VULNERABLE - DO NOT USE)

- ~~CryptoAnts: `0x8F022fA4fbbb90eCbDFbBe4ea285b41ED91C1aC6`~~ ❌
- ~~Egg: `0x17b8EF9acFfcFfde6F3b884aAf0936c9cDa096F4`~~ ❌

## 🔐 Security Features

This application interacts with audited smart contracts that have:

- ✅ All critical vulnerabilities fixed (20+ issues resolved)
- ✅ Comprehensive test coverage (39/39 tests passing)
- ✅ Slither static analysis verification
- ✅ Formal verification completed
- ✅ Production-ready deployment

Full security audit: [SECURITY.md](./SECURITY.md)

## 🎨 Design Philosophy

- **Retro Aesthetic** - Pixel-art inspired design with chunky borders and bold colors
- **Web3 Native** - Seamless wallet integration and transaction handling
- **Real-time Updates** - Event-driven architecture for instant UI feedback
- **Accessible** - Clear visual feedback and interactive tutorials
- **Transparent** - All game mechanics visible on-chain

## 🔧 Key Components

### AntColony Component
Manages the display and interaction of all ants:
- Fetches total ant count from contract
- Retrieves ownership and metadata for each ant
- Implements real-time event listeners
- Sorts ants by status (alive/ready/cooldown/dead)
- Filters between user's ants and global colony

### AntCard Component
Individual ant display with:
- Visual representation with deterministic colors
- Status indicators (alive/dead/sold)
- Action buttons (lay eggs/sell)
- Cooldown timer display
- Owner information

## 📊 Contract Interactions

The dApp integrates with two main contracts:

1. **CryptoAnts (ERC721)**
   - `buyEggs()` - Purchase eggs with ETH
   - `createAnt()` - Hatch an egg to mint an NFT ant
   - `layEggs()` - Ant lays eggs (with risk)
   - `sellAnt()` - Burn NFT for ETH
   - `eggPrice()` - Get current egg price
   - `getAntsCreated()` - Get total ant count
   - `antsMetadata()` - Get ant metadata

2. **Egg (ERC20)**
   - `balanceOf()` - Check egg balance
   - Standard ERC20 token (indivisible)

## 🎯 Events Monitored

- `EggsBought` - User purchased eggs
- `AntCreated` - New ant hatched
- `EggsLaid` - Ant laid eggs
- `AntDied` - Ant died during egg laying
- `AntSold` - Ant was sold

## 🤝 Contributing

This project was part of a security challenge and has been completed. The contracts are audited and deployed on testnet for educational and demonstration purposes.

## 📝 License

This project is part of the DeFi Wonderland Challenge.

## 🔗 Links

- [Main Repository](../)
- [Security Audit](../SECURITY.md)
- [CryptoAnts Contract](https://sepolia.etherscan.io/address/0x314a85646a7676d0ad683013f6a835e0e5f522aa)
- [Egg Token Contract](https://sepolia.etherscan.io/address/0x9b9f9965f2c3a8e4870b532d972634f7fc3d73a2)
- [Sepolia Faucet](https://sepolia-faucet.pk910.de/)

---

**Built with ❤️ for the DeFi Wonderland Challenge**

*Challenge Status: ✅ COMPLETED - All vulnerabilities fixed and contracts audited*
