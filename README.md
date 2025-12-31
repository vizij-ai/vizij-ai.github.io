# Semio Community Website

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains the website for [Semio Community](https://semio.community), a 501(c)(3) nonprofit organization facilitating community-driven robotics hardware, software, and research to foster repeatable, reproducible, and replicable science within human-robot interaction (HRI).

## 🤖 About Semio Community

Semio Community is dedicated to advancing **reproducible robot science** by:
- Supporting open-source robotics hardware and software development
- Facilitating community-driven research and collaboration
- Promoting reusable systems in human-robot interaction
- Fostering scientific reproducibility in robotics and AI

## 🚀 Tech Stack

- **Framework**: [Astro v5](https://astro.build/) with React integration
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design system
- **Content**: MDX for rich content authoring
- **Search**: [Pagefind](https://pagefind.app/) for static search
- **Code Quality**: [Biome](https://biomejs.dev/) for linting and formatting
- **Icons**: Solar Icons and Astro Icon
- **Deployment**: GitHub Pages with automated CI/CD

## 📦 Project Structure

```
/
├── public/           # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── assets/       # Images and media files
│   ├── components/   # Reusable React and Astro components
│   ├── config/       # Configuration files
│   ├── content/      # Content collections (blog posts, projects, etc.)
│   ├── data/         # Static data files
│   ├── layouts/      # Page layouts
│   ├── pages/        # File-based routing
│   ├── plugins/      # Remark/Rehype plugins
│   ├── styles/       # Global styles and CSS
│   └── utils/        # Utility functions
├── test/             # Test files
└── docs/             # Documentation
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/semio-community/semio-community.github.io.git
cd semio-community.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to view the site.

### Available Commands

| Command                | Action                                           |
|:----------------------|:--------------------------------------------------|
| `npm run dev`         | Start site + CMS preview dev servers together    |
| `npm run dev:site`    | Start only the Astro dev server                  |
| `npm run dev:cms`     | Start only the Decap CMS preview dev server      |
| `npm run build`       | Build Decap bundle/config, Astro site, and search index |
| `npm run build:site`  | Build only the Astro site to `./dist/`           |
| `npm run build:cms`   | Regenerate Decap config and preview bundle       |
| `npm run build:search`| Generate Pagefind search index                   |
| `npm run preview`     | Preview production build locally                |
| `npm run format`      | Format code with Biome and Prettier            |
| `npm run format:code` | Format code files                              |
| `npm run format:imports` | Organize imports with Biome                 |
| `npm run lint`        | Run Biome linter                               |
| `npm run check`       | Run Astro type checking                        |
| `npm run verify:drafts` | Verify draft content status                  |
| `npm run cms:config`  | Regenerate Decap CMS config from `src/content.config.ts` |
| `npm run cms:preview` | Build Decap CMS preview bundle/styles (outputs to `public/admin`, all gitignored) |

### Build Pipeline

`npm run build` runs, in order:
1) `build:cms` (Decap config + preview bundle into `public/admin/`)
2) `build:site` (Astro to `dist/`)
3) `build:search` (Pagefind index)

### CMS / Admin Regeneration

- Run `npm run build` after changing content schemas or preview components/styles to refresh `public/admin/config.yml` and rebuild the Decap preview bundle (`preview.bundle.js` / `preview.css`).
- `npm run cms:config` rewrites `public/admin/config.yml` from the Astro content schemas.
- `npm run cms:preview` rebuilds the Decap preview assets (Tailwind v4 + Vite).

## ⚙️ Configuration

### Site Configuration

Edit `src/site.config.ts` to update:
- Site metadata (title, description, author)
- Navigation menu items
- Locale and date formatting

### Content Management

- **Pages**: Add `.astro` or `.mdx` files to `src/pages/`
- **Content Collections**: Manage content in `src/content/`
  - `events/` - Community events and symposiums
  - `hardware/` - Robotics hardware projects
  - `partners/` - Partner organizations
  - `people/` - Team and community members
  - `software/` - Software projects and tools
  - `research/` - Research publications and papers
- **Components**: Create reusable components in `src/components/`

### Styling

- **Global Styles**: `src/styles/global.css`
- **Tailwind Config**: Uses Tailwind CSS v4 with `@tailwindcss/vite`
- **Theme**: Automatic dark/light mode support
- **Components**: Use Tailwind utility classes
- **Showcase Styles**: `/showcase` currently links its React island stylesheet via `?url` in `src/pages/showcase.astro` because Astro production builds can omit CSS imported only inside `client:only` islands. Long-term goal: align the showcase to the shared site styles and remove the bespoke stylesheet.
- **React 19 overrides (temporary)**: `package.json` pins `@react-three/*` and `zustand` via `overrides` so the React 19 preview works with `@vizij/render@0.0.7`. Remove these overrides after the React 19 `vizij-web` packages are published.

## 🌟 Key Features

- **🎨 Modern Design**: Clean, accessible interface with dark/light mode
- **📱 Responsive**: Mobile-first design approach
- **⚡ Performance**: Optimized builds with Astro's partial hydration
- **🔍 Search**: Built-in search with Pagefind
- **♿ Accessibility**: WCAG compliant with semantic HTML
- **🔧 Developer Experience**: TypeScript, hot reload, and modern tooling
- **📝 MDX Support**: Rich content authoring with components
- **🎯 SEO Optimized**: Meta tags, sitemap, RSS feed, and Open Graph support

## 📄 Content Sections

The website includes the following main sections:

- **Home**: Introduction to Semio Community and mission
- **Projects**: Community-driven robotics projects
- **Services**: Resources and support offered
- **Events**: Workshops, symposiums, and community gatherings
- **Partners**: Collaborating organizations and institutions
- **About**: Organization details and team
- **Get Involved**: Ways to contribute and participate

## 🚢 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch:

1. Push commits to `main` branch
2. GitHub Actions workflow builds the site
3. Built files are deployed to GitHub Pages
4. Site is available at [https://semio.community](https://semio.community)

## 🤝 Contributing

We welcome contributions from the community! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (enforced by Biome)
- Write descriptive commit messages
- Update documentation as needed
- Test your changes locally before submitting
- Ensure the build passes (`npm run build`)

## 📬 Contact

- **Website**: [semio-community.github.io](https://semio.community)
- **GitHub**: [@semio-community](https://github.com/semio-community)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build/)
- Icons from [Solar Icons](https://www.figma.com/community/file/1166831539721848736)
- Search powered by [Pagefind](https://pagefind.app/)
- Inspired by best practices in open-source robotics communities

---

*Semio Community - Advancing Reproducible Robot Science*
