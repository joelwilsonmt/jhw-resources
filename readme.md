# 2025 React Starter

An opinionated React starter template with modern tooling and best practices.

## 🛠 Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
  - `tailwind-merge` - Merge Tailwind classes
  - `clsx` - Conditional class names
- **ESLint** - TypeScript + React hooks + accessibility rules
- **Prettier** - Code formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (see `.nvmrc`)
- PNPM (package manager)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd 2025-react-starter

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server at http://localhost:3000

# Build
pnpm build        # Build for production

# Linting & Formatting
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
```

## 📁 Project Structure

```
├── src/              # Source files
├── public/           # Static assets
├── dist/             # Build output
├── .vscode/          # VS Code settings
├── eslint.config.js  # ESLint configuration
├── tailwind.config.js # Tailwind configuration
├── vite.config.ts    # Vite configuration
└── tsconfig.json     # TypeScript configuration
```

## 🔧 Configuration

This starter comes pre-configured with:

- **TypeScript**: Strict mode enabled with modern settings
- **ESLint**: TypeScript, React hooks, and accessibility rules
- **Prettier**: Consistent code formatting
- **Tailwind CSS**: Utility-first styling with PostCSS
- **Vite**: Fast HMR and optimized builds

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
