@slid/schema
==================

The typed contract for **Slid**: deck/slide schema (Zod), design tokens,
and the layout registry. Both the Vue renderer and the Rust API import from
this package so the AI pipeline, validation, and rendering are anchored to one
source of truth.

This is a workspace of the [Slid monorepo](../README.md). All commands
are run from the repo root:

````
$ npm install            # at repo root
$ npm run build:schema   # compiles dist/
$ npm run test:schema    # Jest with --coverage (100% target)
````
