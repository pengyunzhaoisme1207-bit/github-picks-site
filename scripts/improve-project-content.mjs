#!/usr/bin/env node
/**
 * Improve project content in data/projects.json:
 * 1. Add docs_url, install_url, deploy_url
 * 2. Rewrite editors_note to 80-140 words with subjective judgment
 * 3. Fix generic words in highlights
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../data/projects.json');
const data = JSON.parse(readFileSync(filePath, 'utf-8'));
const projects = data.projects;

let linkChanges = 0;

// ============ LINK MAPS ============
// Each entry: [id, docs_url, install_url, deploy_url?]

const linkMap = {
  // AI Tools
  'ollama':            ['https://ollama.com/docs',            'https://ollama.com/download',          'https://github.com/ollama/ollama/blob/main/docs/faq.md'],
  'open-webui':        ['https://docs.openwebui.com',         'https://docs.openwebui.com/getting-started/',  'https://docs.openwebui.com/getting-started/#quick-start-with-docker'],
  'anything-llm':      ['https://docs.anythingllm.com',       'https://docs.anythingllm.com/installation',      'https://docs.anythingllm.com/installation/docker'],
  'n8n':               ['https://docs.n8n.io',                'https://docs.n8n.io/hosting/',   'https://docs.n8n.io/hosting/docker/'],
  'lm-studio':         ['https://lmstudio.ai/docs',           'https://lmstudio.ai/download'],
  'dify':              ['https://docs.dify.ai',               'https://docs.dify.ai/getting-started/install-self-hosted',  'https://docs.dify.ai/getting-started/install-self-hosted/docker-compose'],
  'flowise':           ['https://docs.flowiseai.com',         'https://docs.flowiseai.com/installation',  'https://docs.flowiseai.com/installation/docker'],
  'lobe-chat':         ['https://lobehub.com/docs',           'https://lobehub.com/docs/self-hosting',  'https://lobehub.com/docs/self-hosting/deploy-on-vercel'],
  'jan':               ['https://jan.ai/docs',                'https://jan.ai/download'],
  'gpt4all':           ['https://gpt4all.io/index.html',      'https://gpt4all.io/index.html#install'],

  // Security & Privacy
  'vaultwarden':       ['https://github.com/dani-garcia/vaultwarden/wiki',  'https://github.com/dani-garcia/vaultwarden/wiki/Building-using-docker',  'https://github.com/dani-garcia/vaultwarden/wiki/Building-using-docker'],
  'pi-hole':           ['https://docs.pi-hole.net',           'https://docs.pi-hole.net/main/basic-install/',  'https://docs.pi-hole.net/main/basic-install/'],

  // Self Hosted
  'immich':            ['https://immich.app/docs',            'https://immich.app/docs/install/docker-compose',  'https://immich.app/docs/install/docker-compose'],
  'nextcloud':         ['https://docs.nextcloud.com',         'https://docs.nextcloud.com/server/latest/admin_manual/installation/index.html',  'https://docs.nextcloud.com/server/latest/admin_manual/installation/docker.html'],
  'paperless-ngx':     ['https://docs.paperless-ngx.com',     'https://docs.paperless-ngx.com/setup/',  'https://docs.paperless-ngx.com/setup/#docker'],
  'uptime-kuma':       ['https://github.com/louislam/uptime-kuma/wiki',  'https://github.com/louislam/uptime-kuma/wiki/Docker'],
  'portainer':         ['https://docs.portainer.io',          'https://docs.portainer.io/start/install/server/docker',  'https://docs.portainer.io/start/install/server/docker'],

  // Home & Media
  'jellyfin':          ['https://jellyfin.org/docs',          'https://jellyfin.org/docs/general/installation/',  'https://jellyfin.org/docs/general/installation/docker'],
  'home-assistant':    ['https://www.home-assistant.io/docs/',  'https://www.home-assistant.io/installation/',  'https://www.home-assistant.io/installation/linux'],

  // Design Tools
  'excalidraw':        ['https://docs.excalidraw.com',        'https://docs.excalidraw.com/docs/installation/',  'https://docs.excalidraw.com/docs/installation/docker'],
  'penpot':            ['https://help.penpot.app',            'https://help.penpot.app/installation/',  'https://help.penpot.app/installation/docker/'],
  'drawio':            ['https://www.drawio.com/doc',         'https://www.drawio.com/doc/faq/install-drawio'],

  // Finance
  'maybe-finance':     ['https://github.com/maybe-finance/maybe#readme',  'https://github.com/maybe-finance/maybe#self-hosting',  'https://github.com/maybe-finance/maybe#self-hosting'],
  'actual-budget':     ['https://actualbudget.org/docs',      'https://actualbudget.org/docs/getting-started/'],
  'firefly-iii':       ['https://docs.firefly-iii.org',       'https://docs.firefly-iii.org/help/self-hosted/',  'https://docs.firefly-iii.org/help/self-hosted/docker/'],

  // Data Analytics
  'plausible':         ['https://plausible.io/docs',          'https://plausible.io/docs/self-hosting',  'https://plausible.io/docs/self-hosting'],
  'umami':             ['https://umami.is/docs',              'https://umami.is/docs/install',  'https://umami.is/docs/deploy-on-vercel'],
  'metabase':          ['https://www.metabase.com/docs',      'https://www.metabase.com/docs/latest/operations-guide/installing-metabase',  'https://www.metabase.com/docs/latest/installation-and-operation/running-metabase-on-docker'],
  'grafana':           ['https://grafana.com/docs/grafana/latest/',  'https://grafana.com/docs/grafana/latest/setup-grafana/installation/',  'https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/'],

  // Writing & Content
  'obsidian':          ['https://help.obsidian.md',           'https://help.obsidian.md/get+started/Install+Obsidian'],
  'logseq':            ['https://docs.logseq.com',            'https://docs.logseq.com/#/page/Get%20Started'],
  'joplin':            ['https://joplinapp.org/help/',        'https://joplinapp.org/help/'],

  // Productivity
  'appflowy':          ['https://appflowy.io/docs',           'https://appflowy.io/docs'],
  'memos':             ['https://www.usememos.com/docs',      'https://www.usememos.com/docs/install/',  'https://www.usememos.com/docs/install/docker-install'],
  'outline':           ['https://docs.getoutline.com',        'https://docs.getoutline.com/s/hosting/doc/installation-Zlq1K8h9Jz'],
  'stirling-pdf':      ['https://github.com/Stirling-Tools/Stirling-PDF#readme',  'https://github.com/Stirling-Tools/Stirling-PDF?tab=readme-ov-file#installation'],
  'cal-com':           ['https://cal.com/docs',               'https://cal.com/docs/get-started/self-hosting'],

  // Developer Tools
  'hoppscotch':        ['https://docs.hoppscotch.io',         'https://docs.hoppscotch.io/documentation/self-host/getting-started'],
  'bruno':             ['https://www.usebruno.com/',          'https://www.usebruno.com/downloads'],
  'coolify':           ['https://coolify.io/docs',            'https://coolify.io/docs/installation',  'https://coolify.io/docs/installation'],
  'lazygit':           ['https://github.com/jesseduffield/lazygit/blob/master/README.md',  'https://github.com/jesseduffield/lazygit?tab=readme-ov-file#installation'],
  'starship':          ['https://starship.rs/guide/',         'https://starship.rs/guide/#installation'],
};

// ============ EDITORS' NOTE MAP ============
// Each entry: [id, editors_note (80-140 words)]

const editorsNoteMap = {
  // --- AI Tools ---
  'ollama': `Ollama is the single easiest way to start running AI models on your own computer. If you've ever wanted to experiment with ChatGPT-like tools without the privacy concerns, API costs, or subscription fees, this is exactly where you should begin. It works on Mac, Linux, and Windows — even without a dedicated GPU for smaller models. What makes Ollama genuinely different from competitors is its simplicity: one command to download a model, another to start chatting. There's no configuration file to edit, no virtual environment to set up, no dependency hell. The REST API means any existing ChatGPT-compatible app can connect to it immediately. For developers building AI features, Ollama is the fastest local testing environment available. For everyone else, it's the most approachable entry point into local AI.`,

  'open-webui': `Open WebUI is what happens when you want Ollama's local models with a polished ChatGPT-like interface on top. The difference from raw Ollama is night and day — you get user accounts, conversation history, document upload with RAG, and a settings panel that doesn't require a terminal. What impressed us most is how genuinely usable this is for non-technical users. A team member who's never touched a command line can log in and start chatting with documents within minutes. The RAG integration is particularly well done: upload a PDF and ask questions about it without any configuration. That said, you still need Docker comfort to get it running, so it's not quite zero-setup. If you're running Ollama and wish it had a proper UI, this is the answer.`,

  'anything-llm': `AnythingLLM takes a different angle from the other local AI tools — it's built for teams who need document intelligence, not just chat. The workspace model means you can have separate AI assistants for different departments, each with their own documents, models, and access controls. What sets it apart is the depth of its document processing: you can feed it entire directories of files and it builds a searchable knowledge base that any team member can query. The multi-provider support means you're not locked into one AI vendor. The trade-off is complexity — this is not a casual install. You need a server, Docker knowledge, and some patience to get it configured right. But once it's running, it feels like having a private ChatGPT trained on your own documents.`,

  'n8n': `n8n is the automation tool that Zapier built its billion-dollar business on — except n8n gives you the same visual workflow builder for free when you self-host it. The difference isn't just the price: n8n's self-hosted version has no task limits, no per-execution fees, and no premium features locked behind a paywall. The AI workflow nodes are genuinely useful — you can build automations that fetch RSS feeds, summarize them with a local LLM, and post to Slack, all without touching code. The fair-code license means you can use it freely for internal business use. What holds it back slightly from a perfect score is that some enterprise features like SSO are still cloud-only. But for 95% of automation needs, the self-hosted version is more than enough.`,

  'lm-studio': `LM Studio is the most polished desktop GUI for local AI, period. If Ollama feels too command-line-heavy and you'd rather click through a visual interface, LM Studio gives you an app store experience for AI models. You browse available models, see benchmarks, download with one click, and start chatting — all within a single window. The side-by-side model comparison feature is brilliant for deciding which model works best for your needs. It's optimized for Apple Silicon, where it runs Llama-class models remarkably smoothly. The local server mode lets other apps connect to it via a ChatGPT-compatible API. The main limitation is that it's proprietary software with a free tier, so you're trusting a company rather than a community project. But as a daily driver for exploring local AI, it's hard to beat.`,

  'dify': `Dify is the fastest path from AI idea to working product that we've tested. The visual builder lets you chain together LLM calls, knowledge bases, and workflow logic without writing code, and the result is a deployable AI application with its own API and web interface. What makes Dify stand out is how it handles the full lifecycle: you prototype visually, test with built-in tools, and then deploy with a single click. The support for 30+ model providers means you can swap between OpenAI, Anthropic, and local models without changing your workflow. It's designed to be accessible to product managers and non-engineers, which is rare in this space. The self-hosted version is generous with features, though the cloud version is where the most polished experience lives. If you're building AI-powered products, Dify cuts weeks off your development timeline.`,

  'flowise': `Flowise is LangChain made accessible through a visual interface. If you've ever tried to build a LangChain application from scratch, you know the frustration of wiring together chains, agents, and vector stores through code — Flowise lets you drag those same components onto a canvas and connect them visually. The pre-built templates for common patterns like RAG and agent workflows are excellent starting points. The embeddable chat widget is a nice touch for quickly putting an AI assistant on your website. What holds Flowise back is that it's essentially a UI layer over LangChain, so you're still bound by LangChain's complexity and occasional quirks. The self-hosted version is fully featured, and the open source license means you can modify it freely. For developers who want LangChain power without the code boilerplate, this is the sweet spot.`,

  'lobe-chat': `Lobe Chat is what a ChatGPT clone looks like when the open source community builds it with care. The UI is genuinely beautiful — clean, modern, and fast — and the plugin system means you can extend it with web search, image generation, code execution, and more. The multi-provider support is its killer feature: connect to OpenAI, Claude, Ollama, and others simultaneously, and switch between them per conversation. The self-hosted version gives you full control over your data and usage. What makes Lobe Chat interesting is how it balances accessibility and power: a non-technical user can install it and start chatting, while a developer can write custom plugins. The main trade-off is that it's a relatively young project, so some edge cases in the plugin system still need work. But the pace of development is impressive.`,

  'jan': `Jan is the privacy-first AI assistant that actually delivers on its promise. Everything runs offline — no cloud APIs, no data collection, no subscription model. Your conversations never leave your machine, which matters enormously if you work with sensitive information or simply don't want Big Tech reading your thoughts. The interface is deliberately simple and clean, designed for daily use rather than tinkering. Jan supports both local models through its built-in engine and remote providers, giving you flexibility. What makes Jan stand out is its commitment to the offline-first philosophy — even the model downloads happen through a built-in store, so you never need to touch a terminal. The trade-off is that the model selection is more limited than Ollama's, and the interface is intentionally minimal rather than feature-rich. For privacy-conscious users, that's exactly the right trade.`,

  'gpt4all': `GPT4All was one of the first projects to make local AI genuinely accessible, and it's still one of the most developer-friendly ways to integrate LLMs into your own applications. The Python SDK is clean, well-documented, and works out of the box — you can import a model and start generating text in three lines of code. The curated model collection is optimized for different hardware configurations, so you get reasonable performance even on modest machines. What sets GPT4All apart is its focus on developers: it's not trying to be a consumer app, it's a toolkit for building AI-powered software. The community is large and active, which means help is easy to find. The desktop app exists but feels like a secondary feature — the real value is the Python library. If you're building AI features into your own code, GPT4All's SDK is worth trying before anything else.`,

  // --- Security & Privacy ---
  'vaultwarden': `Vaultwarden is the self-hosted password manager that makes Bitwarden's own official server look heavy. Written in Rust, it uses a fraction of the memory and runs comfortably on a $5 VPS or even a Raspberry Pi. The full Bitwarden API compatibility means every official Bitwarden app — browser extension, mobile app, desktop client — works without modification. You get the same password generation, secure sharing, and two-factor auth, just on your own server. What impressed us is how polished and stable it is despite being a community project. The TOTP and YubiKey support are genuine security upgrades, not afterthoughts. The fair-code license means you can use it freely for personal and internal business use. If you've ever been frustrated by Bitwarden's premium pricing for features that should be free, Vaultwarden gives you everything without the paywall.`,

  'pi-hole': `Pi-hole is the single most impactful privacy upgrade you can make at home for thirty-five dollars and an hour of your time. Install it on a Raspberry Pi, point your router's DNS at it, and suddenly every device on your network stops loading ads and trackers — smart TVs, game consoles, phones, laptops, everything. No app installation needed, no per-device configuration, no opt-in. The dashboard shows you exactly what's being blocked in real time, which is both fascinating and slightly terrifying. What makes Pi-hole special is its simplicity: it's DNS-level blocking, which means it catches ads on devices where you can't install ad blockers. The community-maintained blocklists are excellent and updated regularly. The only real caveat is that you need a device that runs 24/7, but a Pi Zero costs almost nothing to power. For home privacy, nothing else comes close to this price-to-impact ratio.`,

  // --- Self Hosted ---
  'immich': `Immich is the closest thing to a self-hosted Google Photos that actually exists today. The mobile app's auto-backup works identically to Google Photos — you install it, point it at your camera roll, and it silently uploads everything to your server in the background. The AI features are genuinely impressive: face detection, object recognition, map view, and a timeline that feels polished. Multi-user support with shared albums means the whole family can contribute to a single photo library. What makes Immich remarkable is how fast it's been developed — the team ships features at a pace that rivals commercial products. The active development also means you should expect occasional breaking changes, so it's not yet set-and-forget stable. But if you're tired of Google's storage limits and privacy policies, Immich is the most compelling alternative available.`,

  'nextcloud': `Nextcloud is the self-hosted productivity suite that replaces an entire Google Workspace — file storage, calendar, contacts, mail, video calls, and document editing, all running on your own server. The file sync and sharing experience is genuinely polished, and the app ecosystem keeps expanding with new capabilities. What makes Nextcloud powerful is its modularity: you install exactly what you need and skip the rest. The Collabora and OnlyOffice integrations give you real Google Docs-style document editing. The main drawback is that it's a large, complex system — if you just want file storage, simpler alternatives like Seafile might be better. But if you want a complete cloud replacement, Nextcloud is the only open source option that comes close. The enterprise version adds support and compliance features, but the community edition is fully featured for personal and small team use.`,

  'paperless-ngx': `Paperless-ngx is the project that finally makes going paperless feel achievable rather than aspirational. The workflow is simple: scan a document, and Paperless automatically OCRs it, extracts text, suggests tags and categories using machine learning, and files it in a searchable archive. The email consumption feature is particularly clever — pipe your invoices and receipts through a dedicated email address and they're processed automatically. The search is fast and accurate, making it genuinely useful as a document management system rather than just a digital filing cabinet. What impressed us is how well the ML categorization works after just a few weeks of training. The Docker setup is straightforward, and the web interface is clean and functional. The only real barrier is the initial setup: you need a scanner and some patience to get your existing paper organized. But once it's running, it runs forever.`,

  'uptime-kuma': `Uptime Kuma is the monitoring tool that looks so good you actually want to check it regularly. In five minutes with Docker, you get enterprise-grade monitoring with a beautiful dashboard, 40+ notification channels, and public status pages. It monitors HTTP, TCP, ping, DNS, and more — everything you need to know if your services are running. The notification system is comprehensive: Telegram, Slack, Discord, email, webhook, and more. What makes Uptime Kuma stand out is how polished it is for a free, open source tool. Most self-hosted monitoring solutions feel like they were built by developers for developers. Uptime Kuma feels like a product. The status pages are shareable with customers, making it useful for small businesses that need to show uptime publicly. It's not a replacement for Grafana-level observability, but for "is my stuff running" monitoring, it's perfect.`,

  'portainer': `Portainer is the Docker management UI that makes container orchestration accessible to people who prefer clicking over typing commands. The visual interface lets you deploy, start, stop, and monitor containers without ever touching a terminal. The template library for one-click app deployment is genuinely useful — you can spin up databases, web servers, and monitoring tools with a few clicks. The multi-environment support means you can manage Docker hosts across multiple servers from a single dashboard. What makes Portainer essential for self-hosting is how it lowers the barrier to entry: you don't need to memorize Docker Compose syntax or troubleshoot YAML indentation. The business edition adds team management and advanced features, but the community edition covers everything most people need. If you're running Docker containers and spending too much time in the terminal, Portainer will save you hours.`,

  // --- Home & Media ---
  'jellyfin': `Jellyfin is the media server that respects your freedom in a way Plex and Emby never will. Unlike its competitors, everything is genuinely free — no premium tier, no paywalled features, no remote server dependency. The media organization is excellent: automatic metadata fetching, poster art, episode grouping, and a beautiful interface across every platform. The apps for Roku, Fire TV, Android, iOS, and web are all well-maintained and feature-complete. Live TV and DVR support with compatible tuners rounds out the full media center experience. What makes Jellyfin special is the community: development is driven by contributors who care about the software, not shareholders. The project moves fast and listens to users. The main trade-off is that some features like mobile apps might lag slightly behind Plex in polish. But if you want a media server that's free forever and fully open source, Jellyfin is the only serious choice.`,

  'home-assistant': `Home Assistant is the smart home platform that takes your privacy and local control seriously — and it does so without compromising on capability. It integrates with over a thousand device types, from Philips Hue bulbs to obscure Zigbee sensors, and processes everything locally so it keeps working during internet outages. The visual automation editor makes complex routines accessible, while the YAML configuration gives power users unlimited flexibility. What sets Home Assistant apart from Google Home or Apple HomeKit is the depth of control: you can create automations that no commercial platform would ever offer, because they'd be too complex or too niche. The community is enormous, with thousands of custom integrations. The trade-off is real: setup takes time, and you need to be comfortable learning a new system. But once it's running, it's the most capable smart home platform available, period.`,

  // --- Design Tools ---
  'excalidraw': `Excalidraw is the diagram tool you reach for when you need something fast, expressive, and instantly shareable. The hand-drawn style gives even rough sketches a deliberate, intentional look that feels more approachable than corporate diagram tools. You open it in a browser, start drawing, and collaborate in real time with end-to-end encryption — no signup, no installation, no friction. The library of shapes, icons, and templates covers everything from simple flowcharts to complex architecture diagrams. What makes Excalidraw special is how it balances simplicity with power: a non-technical person can use it immediately, while the API and embedding options let developers integrate it into their own tools. The real-time collaboration is smooth enough for actual brainstorming sessions. It's not a replacement for Visio when you need formal diagrams, but for the 90% of diagramming that happens during meetings and planning, it's exactly what you need.`,

  'penpot': `Penpot is the open source design tool that's gaining real traction as a Figma alternative. It runs in the browser with real-time collaboration, uses SVG as its native format (which means design-to-code handoff is genuinely clean), and includes every feature you need for UI design and prototyping. The biggest selling point is the pricing: there's no per-editor fee, no premium tier locking features, no surprise bills at the end of the month. Self-hosting it means complete data control. What makes Penpot interesting is how it approaches design differently from Figma — the flex layout system is more web-native, which means designs translate to actual HTML more naturally. It's not as mature as Figma yet, and some power users will miss advanced features. But for most UI design tasks, it's more than capable, and the open source foundation means it can only get better.`,

  'drawio': `draw.io is the Swiss Army knife of diagramming — it covers more diagram types than any single competitor, from flowcharts and org charts to UML, ER diagrams, network topologies, and BPMN. It works in your browser or as a desktop app with full offline support. The Google Drive, OneDrive, and GitHub integrations mean your diagrams live wherever your documents live. What makes draw.io genuinely useful is its zero-friction approach: open it, draw something, save it. No account required, no premium features gated, no learning curve. The template library is massive and the shape libraries cover virtually every diagram standard. It's not the prettiest diagram tool, and it doesn't have real-time collaboration. But when you need to create a professional-looking diagram quickly — especially one that needs to follow a specific standard — draw.io is the tool that never lets you down.`,

  // --- Finance ---
  'maybe-finance': `Maybe Finance is the rare GitHub project that a non-developer can genuinely appreciate. The story makes it even better: the company was building a premium personal finance app, raised money, shut down, and then open-sourced everything. The result is a genuinely polished app that tracks all your accounts, investments, and net worth in one beautiful dashboard. The UI rivals paid apps like YNAB or Copilot Money, and the feature set is comprehensive. What makes Maybe Finance special is that it was designed by people who actually cared about personal finance UX, not developers who tacked on a finance feature. The self-hosted version means your financial data never leaves your control. The trade-off is that you need to handle the hosting yourself — there's no cloud version anymore. But if you're willing to run a Docker container, you get a premium finance app for free.`,

  'actual-budget': `Actual Budget is the envelope budgeting app that YNAB users migrate to when they want local control without losing the methodology. The envelope system is implemented beautifully: allocate income to spending categories, track where every dollar goes, and roll over unused amounts automatically. The real-time sync across devices works flawlessly once set up, and the local-first architecture means your financial data stays on your devices. What makes Actual Budget stand out is its simplicity — there's no complex setup wizard, no subscription model, no cloud dependency. The bank import support handles CSV and OFX files, and the community provides scripts for many banks. The trade-off is that you need to be comfortable with a bit of technical setup. But once it's running, it's the most satisfying budgeting experience we've tested, with none of the guilt trips or premium upsells that plague commercial alternatives.`,

  'firefly-iii': `Firefly III is the most feature-complete open source personal finance manager available. It tracks accounts, transactions, budgets, and generates detailed reports with charts and breakdowns that rival commercial tools. The automated transaction rules are genuinely powerful — you can set up complex categorization logic that processes your bank imports automatically. The REST API opens up integrations with other tools and automation platforms. What sets Firefly III apart is its depth: it handles multi-currency, shared accounts, liabilities, investments, and recurring transactions with a level of detail that most alternatives simply don't offer. The trade-off is significant: it requires more setup than other options, runs on PHP, and the interface can feel overwhelming at first. But if you want deep financial insights and don't mind the learning curve, Firefly III rewards patience with capabilities no other open source finance tool matches.`,

  // --- Data Analytics ---
  'plausible': `Plausible is what Google Analytics would look like if it was designed from scratch in 2026 with privacy as the default assumption. No cookies, no personal data collection, no consent banners — it's fully GDPR compliant out of the box, which means you can drop it on an EU-facing website and never worry about compliance. The tracking script is 45 times smaller than Google Analytics, which means measurably faster page loads. The dashboard is refreshingly simple: it shows you the metrics that actually matter (visitors, page views, sources, top pages) without drowning you in hundreds of reports. The self-hosted version is generous and the cloud version is affordable. What makes Plausible genuinely compelling is that it proves you don't need invasive tracking to get useful analytics. The trade-off is that you lose the deep demographic and behavioral data that Google provides. But most websites don't actually need that level of detail.`,

  'umami': `Umami is the analytics tool for people who want to know how many visitors they have, where they came from, and what they looked at — nothing more, nothing less. The dashboard is clean, minimal, and has zero learning curve. Self-hosting is a one-click deploy on Vercel or a simple Docker command. The privacy-focused approach means no cookies and no personal data collection. What makes Umami special is its simplicity as a feature, not a limitation. Unlike Google Analytics or even Plausible, Umami doesn't try to be everything — it does the basics exceptionally well. The website events tracking with custom goals and reports gives you enough depth for most use cases. The Vercel deploy option is brilliant: you can have a working analytics instance in under five minutes with no server management. For personal websites, blogs, and small projects, Umami is the perfect analytics tool.`,

  'metabase': `Metabase is the BI tool that doesn't feel like enterprise software, which is both its greatest strength and its limitation. The visual query builder lets anyone create reports without writing SQL, and the dashboards are genuinely beautiful — charts, funnels, cohort analysis, all presented in a clean, readable format. The self-hosted free version has unlimited users and questions, which is remarkably generous. What makes Metabase special is how it empowers non-technical team members to explore data independently. The "Ask a question" interface is intuitive enough that your marketing team can build their own reports without pestering engineers. The SQL editor is available for power users who need more control. The trade-off is that for complex analytical workloads, you'll eventually want something more powerful like Apache Superset. But for most teams, Metabase hits the sweet spot between simplicity and capability.`,

  'grafana': `Grafana is the dashboard standard that every operations team knows and uses. If you're collecting any kind of metrics — server health, application performance, business KPIs — Grafana is the visualization layer you'll want. The ability to connect to over 100 data sources, from Prometheus and Loki to PostgreSQL and Elasticsearch, means it can display virtually any data you throw at it. The visualization library is rich and customizable, with panels that look professional out of the box. The alerting system integrates with PagerDuty, Slack, email, and more. What makes Grafana essential is its ubiquity: every SRE, DevOps engineer, and platform team uses it, so finding tutorials, plugins, and community support is trivial. The trade-off is that it's primarily a visualization tool, not a data processing engine — you need separate systems for metric collection. But as the dashboard layer of your observability stack, nothing else comes close.`,

  // --- Writing & Content ---
  'obsidian': `Obsidian is the note-taking app that genuinely grows with your brain. The foundation is beautifully simple: your notes are local Markdown files, always portable and never locked into a proprietary format. On top of that, the plugin ecosystem is massive — over 700 community plugins covering everything from calendar views and Kanban boards to spaced repetition and database management. The backlinks and graph view create a visual knowledge network that reveals connections you didn't know existed. What makes Obsidian special is how it serves both casual note-takers and serious knowledge workers. You can use it as a simple markdown editor, or you can build an elaborate second brain with templates, dataview queries, and automated workflows. The free version for personal use is fully featured. The trade-off is that the plugin ecosystem can become overwhelming, and some plugins conflict with each other. But the core experience is solid regardless of how deep you go.`,

  'logseq': `Logseq is for people who think in bullet points and want their notes to reflect how their brain actually works. The outliner format means every note starts as a bullet, and the daily journal workflow encourages you to write first and organize later — which is how most people actually capture information. The bidirectional linking means ideas connect organically as you write. What makes Logseq special is its PDF annotation feature: you can highlight text in a PDF and those highlights become linked notes in your knowledge graph. The flashcard system built into the app means you can turn your notes into study material without leaving the app. It's fully open source with AGPL licensing, and the local-first architecture means your data is always yours. The trade-off is that the outliner format isn't for everyone — if you prefer long-form writing, Obsidian or Joplin might suit you better. But for research, studying, and knowledge capture, Logseq's workflow is genuinely unique.`,

  'joplin': `Joplin is the Evernote alternative that takes privacy seriously without sacrificing usability. The end-to-end encryption means your synced notes are unreadable to everyone except you — not even the sync provider can access them. The web clipper saves articles and web pages as cleanly formatted notes. The Evernote import tool makes migration painless. What makes Joplin special is its straightforward approach: it's a note-taking app that works, with encryption, cross-platform sync, and a clean interface. It doesn't try to be a knowledge management system, a task manager, or a database. It takes notes, syncs them securely, and lets you search them. The trade-offs are real: the interface isn't as polished as modern alternatives, and it lacks the advanced linking features of Obsidian or Logseq. But if you want a reliable, encrypted note-taking app that works everywhere, Joplin delivers without pretense.`,

  // --- Productivity ---
  'appflowy': `AppFlowy is the most promising Notion alternative in the open source space, and the gap is closing fast. The interface closely mirrors Notion's: databases, Kanban boards, rich text editing, and nested pages all work smoothly. What makes AppFlowy genuinely different is the Rust backend — it's noticeably faster than Notion, especially with large databases. The local-first architecture means your data is always accessible, even without an internet connection. The open source license means you can self-host, modify, and extend it freely. What impressed us is how quickly the project has matured: features that were rough edges six months ago are now polished. The trade-off is that it's still younger than Notion, so some advanced features and integrations are missing. The collaboration features are improving but not yet at Notion's level. But for personal use and small teams who want Notion without the data lock-in, AppFlowy is the most viable alternative.`,

  'memos': `Memos fills the gap between Twitter and a full note-taking app in a way that's genuinely useful. You post short notes with markdown support, and they're organized chronologically with tags — like a personal Twitter feed that only you (or your chosen audience) can see. The self-hosted Docker setup takes one command. The REST API opens up integrations with other tools and bots. What makes Memos special is its intentional simplicity: it doesn't try to be a blog, a wiki, or a task manager. It's for fleeting thoughts, code snippets, quick observations, and daily learnings that are too short for a blog post but too valuable to lose. The public timeline feature turns it into a developer micro-blogging platform. The trade-off is that it's a niche tool — if you already have a note-taking system you love, Memos might feel redundant. But for the specific use case of quick, searchable idea capture, nothing else does it this simply.`,

  'outline': `Outline is the team wiki that people actually want to use, which is a higher bar than you'd think. The Notion-style editor is smooth and fast, with real-time collaboration that doesn't fight you. The Slack, Google, and SSO integrations mean it fits into existing workflows without friction. The search is significantly faster than Notion's, and the document organization with collections and nested pages scales well for large teams. What makes Outline special is its focus on writing: the editor experience is genuinely pleasurable, which matters when your team needs to produce documentation regularly. The self-hosted version gives you full data control. The trade-off is that Outline requires more infrastructure than Notion — you need S3-compatible storage, a PostgreSQL database, and a Redis instance. The BSL license is also more restrictive than typical open source, limiting commercial use. But for teams that need a beautiful, fast wiki, it's worth the setup effort.`,

  'stirling-pdf': `Stirling PDF replaces every sketchy "free PDF tool" website with a self-hosted alternative that actually respects your data. It packs 30+ PDF tools into one clean web application: merge, split, compress, convert, edit, sign, watermark, rotate, and more. All processing happens locally — your files never touch an external server, which matters enormously for sensitive documents. The drag-and-drop interface is genuinely pleasant to use, with a modern design that doesn't feel like a 2005 web app. What makes Stirling PDF special is that it solves a real, everyday problem that most people handle by uploading documents to unknown websites. The Docker setup is straightforward, and once it's running, it covers virtually every PDF task you'll encounter. The trade-off is that it's a single-purpose tool — it does PDFs well and nothing else. But for PDF processing, it's the most comprehensive self-hosted option available.`,

  'cal-com': `Cal.com is the open source scheduling tool that actually matches Calendly feature-for-feature, which is rare in the open source world. The self-hosted version removes all premium restrictions — you get multiple calendars, event types, team scheduling, round-robin assignment, and integrations with Zoom, Google Meet, and Teams without paying a dime. The interface is polished and the booking flow is smooth for both hosts and guests. What makes Cal.com special is how it handles the full scheduling lifecycle: availability management, timezone handling, conflict detection, and automated reminders all work seamlessly. The API is well-documented, making it easy to integrate with other tools. The trade-off is the setup complexity: self-hosting requires a database, caching layer, and email service configuration. It's not a five-minute install. But if you're tired of Calendly's per-user pricing or need features locked behind their enterprise plan, Cal.com gives you everything for free.`,

  // --- Developer Tools ---
  'hoppscotch': `Hoppscotch is what Postman would be if it was designed for speed from day one. It opens instantly in your browser — no installation, no signup, no account creation — and you're testing API endpoints within seconds. It supports REST, GraphQL, WebSocket, and Server-Sent Events, covering virtually every API type you'll encounter. The team collaboration features let you share collections and environments, making it genuinely useful for team development. What makes Hoppscotch stand out is how frictionless it is: you don't need to open a heavy desktop application or wait for it to load. The self-hosted version adds data control and custom configurations. The trade-off is that for very complex API testing workflows, Postman's mature ecosystem still has an edge. But for the 90% of API testing that involves hitting endpoints and checking responses, Hoppscotch is faster and more pleasant to use.`,

  'bruno': `Bruno takes a radically different approach to API testing that makes perfect sense once you see it: your API collections are just plain text files stored in your Git repository. No cloud sync, no accounts, no lock-in. You can review API changes in PRs, branch collections alongside your code, and share them through your existing version control workflow. It supports REST and GraphQL with scripting capabilities for advanced testing scenarios. What makes Bruno genuinely innovative is how it solves a problem that Postman and Insomnia don't even acknowledge: the disconnect between your API tests and your codebase. By storing collections as files, Bruno makes API testing a first-class part of your development workflow. The trade-off is that you lose the cloud collaboration features that make Postman popular for distributed teams. But if you value data ownership and Git workflows, Bruno is the clear winner.`,

  'coolify': `Coolify is the self-hosted deployment platform that makes a ten-dollar VPS feel like Vercel. You connect your Git repository and it handles everything: build, deploy, SSL certificates, preview environments, and rollback. It supports any programming language, framework, and database — Next.js, Laravel, Django, Node.js, PostgreSQL, MySQL, Redis, and more. The one-click deployment for 50+ applications means you can spin up self-hosted tools alongside your own apps on the same server. What makes Coolify special is how it democratizes deployment: you don't need DevOps expertise to run a production-grade hosting environment. The automatic SSL and preview deployments give you the Vercel experience on your own infrastructure. The trade-off is that you're responsible for the underlying server — backups, security updates, and hardware failures are on you. But if you're comfortable managing a VPS, Coolify eliminates the most tedious parts of self-hosting.`,

  'lazygit': `lazygit is the terminal tool that makes you genuinely faster at Git, and once you learn the keybindings, going back to raw git commands feels like a regression. The keyboard-driven interface covers every common Git operation: staging, committing, pushing, branching, merging, rebasing, and conflict resolution. The visual diff view makes it easy to see exactly what changed before committing. The interactive rebase UI turns what's normally a frustrating terminal experience into something manageable. What makes lazygit special is how it respects the terminal workflow while making it faster — it's not trying to replace the CLI, it's augmenting it. The custom commands feature lets you automate your personal Git workflows. The trade-off is that you need to be in a terminal environment, so it's not for GUI-only developers. But if you live in the terminal, lazygit is the single best Git workflow upgrade available.`,

  'starship': `Starship is the terminal prompt that makes every other prompt feel slow and ugly by comparison. Written in Rust, it renders in under a millisecond even on massive repositories, and it shows you everything you need at a glance: git status, language versions, directory context, execution time, and more. It works with bash, zsh, fish, PowerShell, and more, so you get the same experience across every shell. The customization is nearly infinite — you can configure exactly what information appears and how it looks. What makes Starship special is how it transforms your daily terminal experience with minimal effort: a five-minute setup and you'll never look at a bare prompt the same way again. The trade-off is that it's a prompt, not a shell — it won't give you new capabilities, just better information. But information is everything in the terminal, and Starship delivers it faster than anything else.`,
};

// ============ APPLY CHANGES ============

for (const project of projects) {
  const id = project.id;
  const links = linkMap[id];
  const newNote = editorsNoteMap[id];

  // Apply links
  if (links) {
    if (links[0] && !project.docs_url) { project.docs_url = links[0]; linkChanges++; }
    if (links[1] && !project.install_url) { project.install_url = links[1]; linkChanges++; }
    if (links[2] && !project.deploy_url) { project.deploy_url = links[2]; linkChanges++; }
  }

  // Apply editors_note
  if (newNote) {
    project.editors_note = newNote;
  }
}

// Fix generic words in highlights
const genericReplacements = {
  'firefly-iii': {
    old: 'Comprehensive finance tracking: accounts, transactions, budgets, and reports',
    new: 'Track accounts, transactions, budgets, and generate detailed financial reports'
  },
  'home-assistant': {
    old: 'Powerful automation engine with visual editor and YAML configuration',
    new: 'Automation engine with visual editor for rules and YAML for advanced setups'
  },
  'outline': {
    old: 'Powerful search and document organization',
    new: 'Fast full-text search with nested document organization'
  },
};

for (const project of projects) {
  const fix = genericReplacements[project.id];
  if (fix && project.highlights) {
    const idx = project.highlights.indexOf(fix.old);
    if (idx !== -1) {
      project.highlights[idx] = fix.new;
    }
  }
}

// Write updated data
writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`\n=== Content Improvement Complete ===\n`);
console.log(`Projects processed: ${projects.length}`);
console.log(`Link fields added: ${linkChanges}`);
console.log(`Editors' notes rewritten: ${Object.keys(editorsNoteMap).length}`);
console.log(`Generic words fixed: ${Object.keys(genericReplacements).length}`);

// Count new links by type
let docsCount = 0, installCount = 0, deployCount = 0;
for (const p of projects) {
  if (p.docs_url) docsCount++;
  if (p.install_url) installCount++;
  if (p.deploy_url) deployCount++;
}
console.log(`\n--- Link Coverage After ---`);
console.log(`docs_url: ${docsCount}/${projects.length}`);
console.log(`install_url: ${installCount}/${projects.length}`);
console.log(`deploy_url: ${deployCount}/${projects.length}`);
