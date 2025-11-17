# Diacritics Editor

A web-based rich text editor designed for working with diacritical marks across multiple languages. Built with Nuxt 4 and TipTap.

## Features

- Full-featured rich text editing with formatting, tables, links, and images
- Specialized support for diacritical marks and multilingual text
- Small caps formatting
- Local storage with automatic saving
- Export to DOCX and PDF formats
- Light and dark theme support
- Responsive design

## Tech Stack

- **Framework**: Nuxt 4 with Vue 3
- **Editor**: TipTap (extensible rich text editor)
- **UI**: Nuxt UI with Tailwind CSS
- **Storage**: IndexedDB for client-side persistence
- **Export**: pdf-lib and docx libraries

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm typecheck
```

## Project Structure

- `app/` - Application source code
  - `components/` - Vue components
  - `composables/` - Reusable composition functions
  - `utils/` - Utility functions and configurations
  - `design-system/` - Design tokens and styles
- `public/` - Static assets
- `server/` - Server-side code

## License

Private project
