Slidesmith
===============================================

Author: **[Your Name](https://yoursite.dev)**

## Introduction
**Slidesmith** is an AI-powered slide deck creator focused on proposal-quality, visually polished UI slides — the opposite of the generic decks Gamma, Tome, and Beautiful.ai produce. It is composed of three packages in a single monorepo: a Vue 3 + TypeScript frontend, a typed `@slidesmith/schema` shared package, and a Rust + Rocket API.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/your-user/slidesmith)

#### 🚧 Slidesmith is a work in progress.

---

## Screenshots

![Slidesmith](/screenshots/slidesmith.png)

| ![Editor](/screenshots/Editor.webp)         | ![Cover](/screenshots/Cover.webp)         | ![SplitHero](/screenshots/SplitHero.webp)   |
| :-----------------------------------------: | :---------------------------------------: | :-----------------------------------------: |
| ![StatCallout](/screenshots/StatCallout.webp) | ![Quote](/screenshots/Quote.webp)       | ![Agenda](/screenshots/Agenda.webp)         |
| ![BrandKit](/screenshots/BrandKit.webp)     | ![Generate](/screenshots/Generate.webp)   | ![Export](/screenshots/Export.webp)         |

---

## Repo layout
````
slidesmith/         # Vue 3 + TS + Pinia + Tailwind + Vite (frontend)
slidesmith-schema/  # @slidesmith/schema — Zod schema, design tokens, layout registry
slidesmith-api/     # Rust + Rocket + SeaORM + JWT (backend)
````

The TypeScript packages are wired together as **npm workspaces** so a single `npm install` at the repo root installs and links everything. The Rust crate is its own Cargo workspace alongside.

---

## Run

Install JS deps once at the repo root:

````
$ npm install
````

Frontend dev server:

````
$ npm run dev
````

Run the API:

````
$ npm run api:dev
````

(or directly: `cargo run --manifest-path slidesmith-api/Cargo.toml`)

Run database migrations:

````
$ npm run api:migrate
````

## Build
````
$ npm run build
````

## Test
````
$ npm test           # Jest across slidesmith-schema and slidesmith
$ npm run api:test   # cargo test for slidesmith-api
````

---

## Configuration
The API reads the following environment variables. See `slidesmith-api/.env.example`.

| Environment Variable           | Default value | Description                          |
| :----------------------------- | :------------ | :----------------------------------- |
| SLIDESMITH_JWT_SECRET          | `[none]`      | The JWT signing secret. Must be set. |
| SLIDESMITH_DB_HOST             | `localhost`   | Database Host                        |
| SLIDESMITH_DB_PORT             | `5432`        | Database Port                        |
| SLIDESMITH_DB_USERNAME         | `postgres`    | Database Username                    |
| SLIDESMITH_DB_PASSWORD         | `[blank]`     | Database Password                    |
| SLIDESMITH_DB_DATABASE         | `slidesmith`  | Database Name                        |
| SLIDESMITH_OPENAI_API_KEY      | `[none]`      | OpenAI API key (GPT-4o + gpt-image-1)|
| SLIDESMITH_UNSPLASH_ACCESS_KEY | `[none]`      | Unsplash API access key              |
| SLIDESMITH_CHROMIUM_PATH       | `[auto]`      | Path to Chromium for PDF export      |
| ROCKET_ADDRESS                 | `127.0.0.1`   | HTTP Server Bind Address             |
| ROCKET_PORT                    | `8000`        | HTTP Server Port                     |

---

## API

| Method | Path                            | Auth? | Description                                          |
| :----- | :------------------------------ | :---- | :--------------------------------------------------- |
| GET    | /                               | ⬜     | Index. Returns `Slidesmith API`.                     |
| POST   | /auth/sign-up                   | ⬜     | Create a new account.                                |
| POST   | /auth/sign-in                   | ⬜     | Sign in. Returns a JWT on success.                   |
| GET    | /auth/me                        | ✅     | Get the authenticated user's details.                |
| GET    | /decks                          | ✅     | Get the user's decks.                                |
| POST   | /decks                          | ✅     | Create an empty deck.                                |
| GET    | /decks/`{id}`                   | ✅     | Get the deck matching the `id`.                      |
| PUT    | /decks/`{id}`                   | ✅     | Update the deck matching the `id`.                   |
| DELETE | /decks/`{id}`                   | ✅     | Delete the deck matching the `id`.                   |
| POST   | /ai/generate-deck               | ✅     | Generate a full deck from a brief.                   |
| POST   | /ai/regenerate-slide            | ✅     | Regenerate a single slide in a deck.                 |
| POST   | /images/search                  | ✅     | Search Unsplash for an image.                        |
| POST   | /images/generate                | ✅     | Generate an image with OpenAI Images.                |
| POST   | /exports/pdf                    | ✅     | Export a deck to PDF.                                |
| POST   | /exports/pptx                   | ✅     | Export a deck to PPTX. *(501 — deferred)*            |
| POST   | /shares                         | ✅     | Create a shareable read-only link for a deck.        |
| GET    | /shares/`{token}`               | ⬜     | Resolve a share token to deck JSON.                  |

**All auth required requests**: add header `token` with the JWT as the value. Token lifetime: 4 hours.

The versioned AI system prompts live in [slidesmith-api/PROMPTS.md](slidesmith-api/PROMPTS.md). The design philosophy and "how to add a layout/theme without regressing quality" guide lives in [slidesmith/DESIGN.md](slidesmith/DESIGN.md).

---

## Features
- [X] AI deck generation from topic + audience + tone
- [X] Token-driven design system (typography, color, space, grid)
- [X] Strict slide schema (Zod) — AI never emits raw HTML/CSS
- [X] Layout registry (21 entries)
  - [X] Cover
  - [X] Split hero
  - [X] Stat callout
  - [X] Quote
  - [X] Agenda
  - [ ] Timeline
  - [ ] Comparison
  - [ ] Process
  - [ ] Image-led
  - [ ] Data viz
  - [ ] Team
  - [ ] Pricing
  - [ ] Next steps
- [X] Themes
  - [X] Minimal Mono
  - [ ] Editorial
  - [ ] Bold Modern
  - [ ] Corporate Refined
  - [ ] Tech Gradient
  - [ ] Swiss/Grid
- [X] Editor
  - [X] Slide thumbnail sidebar
  - [X] Click to edit / inline text editing
  - [X] Swap layout per slide
  - [X] Regenerate single slide
  - [X] Drag to reorder
  - [X] Brand kit (logo, colors, fonts)
  - [X] Undo / Redo
- [X] Export
  - [X] PDF (vector)
  - [X] Shareable web link
  - [ ] PPTX
- [X] Imagery
  - [X] Unsplash
  - [X] OpenAI Images (gpt-image-1)
- [X] Backend
  - [X] Rocket + SeaORM + JWT
  - [X] /auth/sign-up, /sign-in, /me
  - [X] Deck CRUD
  - [X] Migrations (users, decks, shares)
- [X] Tests
  - [X] Jest with `--coverage` (schema + frontend stores)
  - [X] cargo test (auth, JWT, routes, AI orchestrator with mock)

---

## Contributing
All contributions are welcome. Please create an issue first for any feature request
or bug. Then fork the repository, create a branch and make any changes to fix the bug
or add the feature and create a pull request. That's it!
Thanks!

---

## License
**Slidesmith** is released under the MIT License.
Check out the full license [here](LICENSE).
