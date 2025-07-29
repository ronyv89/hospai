# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application built with TypeScript that integrates GluestackUI components with NativeWind (TailwindCSS for React Native). The project is configured for cross-platform development, allowing components to work on both web and native platforms. Additionally, it includes Mastra integration for AI agents, tools, and workflows.

## Common Development Commands

- `npm run dev` - Start the development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run postinstall` - Apply patches using patch-package (runs automatically after npm install)
- `npm run dev:mastra` - Start Mastra development server
- `npm run build:mastra` - Build Mastra agents, tools, and workflows

## Architecture and Structure

### UI Component System

The project uses a hybrid approach combining GluestackUI with NativeWind:

- **Components Location**: All UI components are in `components/ui/`
- **Dual Platform Support**: Many components have both `index.tsx` (native) and `index.web.tsx` (web) variants
- **Styling**: Uses `styles.tsx` files for component-specific styles alongside NativeWind classes
- **Provider**: `gluestack-ui-provider` handles the UI system configuration

### Key Configuration Files

- **Next.js Config**: `next.config.ts` includes GluestackUI adapter and transpiles NativeWind packages
- **TypeScript**: Uses path mapping with `@/*` pointing to root directory
- **Tailwind**: Extensive color system with CSS variables for theming, includes GluestackUI plugin
- **JSX Source**: Set to "nativewind" for proper styling compilation

### Styling System

The project uses a sophisticated theming system:

- CSS variables for colors (primary, secondary, tertiary, error, success, warning, info, typography, outline, background, indicator)
- Each color has multiple shades (0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
- Dark mode support via "class" strategy
- Custom font families, weights, and box shadows

### Cross-Platform Development

- Components support both React Native and web rendering
- NativeWind enables TailwindCSS usage in React Native components
- React Native Web integration for web compatibility
- Patches applied via patch-package for React Native Web compatibility

### Mastra Integration

The project includes Mastra for AI-powered functionality:

- **Location**: All Mastra code is in the `mastra/` directory
- **Entry Point**: `mastra/index.ts` exports the main Mastra instance
- **Structure**:
  - `mastra/agents/` - AI agents configuration
  - `mastra/tools/` - Custom tools and integrations
  - `mastra/workflows/` - Workflow definitions
- **Dependencies**: Uses `@mastra/core`, `@mastra/libsql`, `@mastra/loggers`, and `@mastra/memory`

### Database Conventions

- **Table Names**: Always use lowercase singular camelCase names (e.g., `department`, `user`, `patient`)
- **Column Names**: Always use camelCase for both Prisma models and database columns
- **Migrations**: ALWAYS use `npx prisma migrate dev --name <descriptive_name>` to generate migrations. NEVER manually create migration files or delete existing migrations as they are committed to version control.
- **Example**:

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

### Import Patterns

- UI components: `@/components/ui/[component-name]`
- Mastra instance: Import from `@/mastra`
- Assets use Next.js Image optimization
- TypeScript paths configured for clean imports

## Development Notes

When working with this codebase:

- Follow the existing dual-file pattern for new UI components (index.tsx + index.web.tsx when needed)
- Use the established color system and CSS variables for consistency
- Ensure new components work across both web and native platforms
- Components should leverage both GluestackUI base functionality and NativeWind styling
- For AI functionality, extend the Mastra setup in the `mastra/` directory
- Use `npm run dev:mastra` to develop and test Mastra agents and workflows
- NEVER reset DB while performing actions, instead create fresh migrations.
