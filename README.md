# Svelte Application

A modern web application built with SvelteKit, featuring authentication, theme switching, and interactive features.

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   │   ├── auth/      # Authentication-related components
│   │   └── ...
│   ├── stores/        # Svelte stores for state management
│   ├── utils/         # Utility functions and helpers
│   └── server/        # Server-side code
├── routes/            # SvelteKit routes
└── app.html           # Main app template
```

## Recent Refactoring Changes

1. **State Management Improvements**
   - Introduced `menuStore.ts` for centralized menu state management
   - Moved user menu logic out of components into dedicated store

2. **Code Organization**
   - Created `utils/easterEgg.ts` for easter egg functionality
   - Improved TypeScript typing and documentation
   - Simplified component logic by extracting complex functionality

3. **Component Cleanup**
   - Removed redundant state management from Header component
   - Improved code readability with better organization and comments
   - Centralized store initialization

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## TypeScript Usage

TypeScript is used selectively where it provides the most value:
- Complex state management (stores)
- Utility functions with complex logic
- Component props with specific requirements

TypeScript files are heavily commented to help JavaScript developers understand the type system and its benefits.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Submit a pull request

## License

MIT
