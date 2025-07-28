# HospAI

A comprehensive Next.js application built with TypeScript that integrates GluestackUI components with Tailwind CSS. The project includes Mastra integration for AI agents, tools, and workflows.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Available Scripts

### Development
- `npm run dev` - Start the development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Mastra AI Integration
- `npm run dev:mastra` - Start Mastra development server
- `npm run build:mastra` - Build Mastra agents, tools, and workflows

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed the database
- `npm run db:seed:usernames` - Seed usernames for existing users

### Maintenance
- `npm run postinstall` - Apply patches using patch-package (runs automatically after npm install)

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15+ with TypeScript
- **UI Components**: GluestackUI with Tailwind CSS
- **AI Integration**: Mastra for agents, tools, and workflows
- **Database**: Prisma ORM
- **Styling**: Tailwind CSS with custom theming system

### Project Structure

```
├── components/ui/          # UI components
├── mastra/                 # AI agents, tools, and workflows
│   ├── agents/            # AI agents configuration
│   ├── tools/             # Custom tools and integrations
│   └── workflows/         # Workflow definitions
├── prisma/                # Database schema and seeders
├── app/                   # Next.js app directory
└── CLAUDE.md             # AI assistant instructions
```

### UI Component System

The project uses GluestackUI components with Tailwind CSS:

- **Components**: Reusable UI components in `components/ui/`
- **Styling**: Uses `styles.tsx` files for component-specific styles alongside Tailwind classes
- **Provider**: `gluestack-ui-provider` handles the UI system configuration
- **Theming**: Sophisticated color system with CSS variables and dark mode support

### Database Conventions

- **Table Names**: Lowercase singular camelCase (e.g., `department`, `user`, `patient`)
- **Column Names**: Always use camelCase for both Prisma models and database columns
- **Mapping**: Use `@@map("table_name")` for consistent database naming

Example:
```prisma
model Department {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("department")
}
```

## 🎨 Styling System

The project features an extensive theming system:

- **CSS Variables**: For colors (primary, secondary, tertiary, error, success, warning, info, typography, outline, background, indicator)
- **Color Shades**: Each color has multiple shades (0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
- **Dark Mode**: Supported via "class" strategy
- **Custom Fonts**: Font families, weights, and box shadows
- **Tailwind CSS**: Utility-first CSS framework for styling

## 🤖 Mastra AI Integration

The project includes Mastra for AI-powered functionality:

- **Location**: All Mastra code is in the `mastra/` directory
- **Entry Point**: `mastra/index.ts` exports the main Mastra instance
- **Components**:
  - `mastra/agents/` - AI agents configuration
  - `mastra/tools/` - Custom tools and integrations
  - `mastra/workflows/` - Workflow definitions
- **Dependencies**: Uses `@mastra/core`, `@mastra/libsql`, `@mastra/loggers`, and `@mastra/memory`

## 🔧 Development Guidelines

### Import Patterns
- UI components: `@/components/ui/[component-name]`
- Mastra instance: Import from `@/mastra`
- TypeScript paths configured for clean imports

### Component Development
- Create reusable UI components in `components/ui/`
- Use the established color system and CSS variables for consistency
- Leverage both GluestackUI base functionality and Tailwind CSS styling

### Code Conventions
- Follow existing patterns and code style
- Use established libraries and utilities
- Ensure security best practices (no exposed secrets/keys)

## 🚢 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [GluestackUI Documentation](https://gluestack.io/) - UI component library
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Mastra Documentation](https://mastra.ai/) - AI agents and workflows platform
- [Prisma Documentation](https://www.prisma.io/docs) - Database toolkit
