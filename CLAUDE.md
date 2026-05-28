# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chinese-language pnpm monorepo providing two complementary React editable table components:
- **`@react-editable-tables/native`** (`packages/editable-table/`) — Zero UI library dependency, uses `@tanstack/react-virtual` for virtual scrolling, CSS variables for theming
- **`@react-editable-tables/formily`** (`packages/fast-editable-table/`) — Built on Formily 2.x + antd 5.x, re-exports Formily APIs so consumers don't need separate installs
- **`@react-editable-tables/docs`** (`packages/docs/`) — VitePress documentation site with interactive React demos mounted inside Vue via `ReactDemo.vue`

## Commands

```bash
pnpm install              # Install all workspace dependencies
pnpm dev:docs             # Start VitePress docs dev server
pnpm build:docs           # Build docs for production
pnpm test                 # Run vitest across all packages
pnpm lint                 # Run biome lint across all packages
pnpm check                # Run biome check (lint + format) across all packages
pnpm type-check           # Run tsc --noEmit across all packages
```

Single package commands (run from package directory):
```bash
cd packages/editable-table
pnpm test                 # Run vitest for native package
pnpm coverage             # Vitest with coverage
pnpm lint                 # Biome lint ./src
pnpm check                # Biome check --write ./src
pnpm type-check           # tsc --noEmit

cd packages/fast-editable-table
pnpm type-check           # tsc --noEmit (only script defined)
```

## Architecture

### Native Package (`editable-table`)

Entry: `src/components/EditableTable/index.tsx` — `EditableTable<T>` forwardRef component with imperative handle (`addRow`, `removeRow`, `moveUp`, `moveDown`, `getData`).

- **State management**: Local React state only — `useState` for data/errors/editingRows
- **Editing modes**: `all` (every cell editable) and `row` (per-row edit/save/cancel with rollback)
- **Virtual scrolling**: Optional, enabled when `scrollY` prop is provided, uses `@tanstack/react-virtual`
- **Column fixing**: Left/right sticky columns with calculated offsets
- **Horizontal scroll**: Header and body scroll containers synchronized via `onScroll` callbacks
- **Validation**: Rule-based (`required`, custom `validator`), triggered on `submit` or `change` via `validateTrigger` prop. Errors keyed as `${rowIndex}-${dataIndex}`
- **Data linkage**: Columns can define `onFieldChange` returning `Partial<T>` or `Promise<Partial<T>>` to update other fields in the same row
- **Cell rendering**: `TableCell.tsx` is memoized with custom comparison for performance
- **Theming**: CSS variables with `--et-*` prefix, dark mode via variable overrides. No CSS-in-JS

### Formily Package (`fast-editable-table`)

Entry: `src/index.ts` — exports `FormilyEditableTable`, `FormilyEditableTableField`, `getRowPath`, plus re-exported Formily APIs.

- **State management**: Formily reactive system (`@formily/reactive`) + `useField`/`useForm` hooks
- **Array tracking**: Uses `reaction()` from `@formily/reactive` to track array length changes; `valueLenRef` prevents `columns` useMemo from rebuilding on every add/remove
- **`FormilyEditableTableField`**: Bridges `@formily/react` `<Field>` with antd components; handles Switch/Checkbox specially (injects `checked` instead of `value`); supports `format`/`parse` value transforms
- **Built-in features**: Pagination (antd PaginationProps), add/remove rows with `min`/`max` constraints, `validateBeforeAdd`
- **Styles**: Auto-injected CSS string via `style.ts` at runtime (id-gated to prevent duplicates)

### Docs (`docs`)

VitePress site with custom `@vitejs/plugin-react` for embedding React demos inside Vue pages. Demos are real source files in `demos/native/` and `demos/formily/`.

## Key Conventions

- **TypeScript strict mode** enabled in all packages
- **Generics**: `EditableTable<T extends object>` for row typing in native package
- **No formal build pipeline** for library packages — `exports` in package.json point directly to `src/` files (consumers bundling handles compilation)
- **Biome** for linting/formatting (no ESLint or Prettier)
- **Vitest** for testing (setup exists in native package but no test files written yet)
- **React 18** pinned via pnpm workspace overrides in `pnpm-workspace.yaml`
