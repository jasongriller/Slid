slidesmith-api
==============

Rust + Rocket + SeaORM + JWT backend for **Slidesmith**.

This crate lives inside the [Slidesmith monorepo](../README.md). The full API
table, configuration variables, and run instructions live in the root README.

From the repo root:

````
$ npm run api:dev       # cargo run
$ npm run api:test      # cargo test
$ npm run api:migrate   # SeaORM migrations: up
````

The versioned AI system prompts live in [PROMPTS.md](./PROMPTS.md).
