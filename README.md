# Portal

A template gallery and design hub built with Next.js 16, React 19, and Tailwind CSS v4.

It serves as the front door for the `_templates` fleet:

- **Template gallery** (`/`) — browse the available templates.
- **Brand Kit** (`/brand-kit`) — colors, typography, and visual identity reference.
- **Setup docs** (`/docs/setup`) — how to spin up a new project from a template.
- **Update docs** (`/docs/update`) — how to keep a deployed project in sync.

## Routes

| Route          | Description           |
| -------------- | --------------------- |
| `/`            | Template gallery      |
| `/brand-kit`   | Brand Kit reference   |
| `/docs/setup`  | Setup guide           |
| `/docs/update` | Update guide          |

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs at http://localhost:3000.

## Scripts

- `pnpm dev` — start the dev server.
- `pnpm build` — production build (`next build`).
- `pnpm start` — serve the production build.
- `pnpm lint` — run the linter.
