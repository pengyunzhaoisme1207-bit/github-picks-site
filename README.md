# GitHubPicks

GitHubPicks is a curated, plain-English directory of useful GitHub projects for real people. The site helps visitors discover open source tools by use case, difficulty, and editorial context instead of forcing them to read developer-first README files.

Production URL: `https://www.githuppick.next-happy.com`

## Agent Entry

Before changing this project, read these files in order:

1. `AGENTS.md`
2. `00-索引.md`
3. `CLAUDE.md`
4. `/Users/jacky.peng/Obsidian/产品制造工厂/仓库最高指导思想指南/README.md`

The project follows the Product Factory rules: independent site, static-first, original content, SEO-ready, AdSense-safe, and no fake production placeholders.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- JSON-driven static generation
- Vercel deployment

## Local Commands

```bash
npm run lint
npm run build
npm run dev
```

`npm run build` can fail in restricted agent sandboxes because Turbopack may need to bind a local process port while compiling CSS. Treat that as an environment issue only when the error explicitly mentions `binding to a port` and `Operation not permitted`.

## Content Model

Primary data lives in:

- `data/projects.json`
- `data/categories.json`
- `data/weekly-picks.json`

Every project entry must include original `one_liner`, `highlights`, `use_cases`, and `editors_note`. Do not copy GitHub README descriptions directly.

## Quality Bar

- English-first content
- One canonical URL per page
- Unique H1 per page
- Project pages include Article JSON-LD
- About, Contact, Privacy, Submit pages must stay live
- AdSense Auto Ads script is allowed; manual ad units require real numeric slot IDs
- No front-end secrets, TODO placeholders, Lorem Ipsum, or fake production ads
