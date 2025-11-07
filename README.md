# Campus Echo Portal

Campus Echo is an interactive portal showcasing Ontario colleges and universities with student-focused resources and helpful guides.

## Getting Started

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and npm installed, then install dependencies and launch the dev server:

```sh
npm install
npm run dev
```

The site will be available at the host and port printed in the terminal (defaults to `http://localhost:8080/`).

## Available Scripts

- `npm run dev` – start the Vite dev server with hot module reloading.
- `npm run build` – build a production-ready bundle.
- `npm run preview` – locally preview the production build.

## Tech Stack

- Vite
- React with TypeScript
- Tailwind CSS
- shadcn/ui

## Project Structure

```
campus-echo-port/
├── public/        # Static assets
├── src/           # Application source
│   ├── components # React components
│   ├── data       # Static datasets
│   ├── pages      # Route-level views
│   └── styles     # Tailwind configuration and global styles
└── vite.config.ts # Vite configuration
```

## Deployment

Build the project with `npm run build`. Deploy the generated `dist/` directory to your preferred static hosting provider such as Vercel, Netlify, or GitHub Pages.
