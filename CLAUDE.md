# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bekhair** is an Islamic productivity application built with Next.js that combines Islamic spirituality with modern productivity tools. The app features Quran reading, prayer time tracking, Quran memorization (hafalan), qibla direction, and Islamic content management.

## Development Commands

```bash
# Development
yarn dev                    # Start development server
npm run dev                 # Alternative with npm

# Production Build
yarn build                  # Build for production
npm run build              # Alternative with npm
yarn start                 # Start production server
npm run start              # Alternative with npm

# Linting
yarn lint                  # Run ESLint
npm run lint               # Alternative with npm

# Post-build
# Automatically runs sitemap generation after build via postbuild script
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with persistence for hafalan (memorization) data
- **Content**: MDX for blog posts and documentation
- **APIs**: External Quran API (`quran-api-tau.vercel.app`) and prayer times API
- **Fonts**: Custom Islamic fonts (UthmanicHafs for Arabic, Kitab-Regular)

### Key Directory Structure

```
app/                        # Next.js App Router pages
├── quran/                  # Quran reading interface
├── hafalan-quran/          # Quran memorization tracking
├── jadwal-shalat/          # Prayer times
├── arah-kiblat/            # Qibla direction
└── blog/                   # Content management

components/                 # React components
├── ui/                     # shadcn/ui base components
├── quran/                  # Quran-specific components
├── prayer-times/           # Prayer time components
├── hafalan/                # Memorization components
└── auth/                   # Authentication components

lib/                        # Utilities and services
├── stores/hafalan-store.ts # Zustand store for memorization data
├── utils/                  # Utility functions
└── api/                    # API integration layers

services/                   # External API services
├── quranServices.ts        # Quran API integration
└── prayerTimesServices.ts  # Prayer times API

types/                      # TypeScript type definitions
├── quran.ts               # Quran data types
├── hafalan.ts             # Memorization types
└── prayerTypes.ts         # Prayer time types
```

### Core Data Models

**Hafalan (Memorization) System:**
- Uses Zustand store with localStorage persistence
- Tracks memorization targets, reviews, and progress
- Implements spaced repetition scheduling
- Stores audio recordings and peer reviews

**Quran Data:**
- Fetches from external API with comprehensive verse metadata
- Includes Arabic text with tajweed, transliteration, and translations
- Supports audio playback and last-read tracking

**Prayer Times:**
- Location-based prayer time calculation
- Supports manual location input and browser geolocation
- Includes next prayer countdown and notifications

### State Management Patterns

**Local Storage Persistence:**
- Hafalan progress stored in `hafalan-storage` key
- Last read Quran position tracking
- User preferences and settings

**API Integration:**
- Axios-based services with error handling
- Configurable API URLs in `config.ts`
- Response type safety with TypeScript interfaces

### Component Architecture

**UI Components:**
- Built on shadcn/ui foundation
- Consistent theming with light/dark mode
- Mobile-responsive design patterns

**Feature Components:**
- Self-contained feature modules (quran, hafalan, prayer-times)
- Shared layout components for consistency
- Reusable utility components

## Development Guidelines

### Adding New Features
1. Create types in appropriate `types/` file
2. Add API services in `services/` if needed
3. Create feature-specific components in `components/[feature]/`
4. Add pages in `app/[feature]/` using App Router
5. Update state management if persistent data needed

### Working with Hafalan System
- Use `useHafalanStore` hook for state management
- Follow existing patterns for review scheduling
- Maintain data structure consistency for localStorage persistence

### API Integration
- Add new API configurations to `config.ts`
- Create typed service functions in `services/`
- Handle errors appropriately with user feedback

### Styling Conventions
- Use Tailwind CSS classes
- Leverage shadcn/ui components when possible
- Maintain responsive design patterns
- Follow existing color scheme and spacing

### MDX Content
- Blog posts stored in `content/posts/`
- Author information in `content/authors/`
- Uses rehype plugins for code highlighting and auto-linking