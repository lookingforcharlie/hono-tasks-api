# Hono Backend Project

- A pure json api

## Install Eslint: [@antfu/eslint-config:](https://github.com/antfu/eslint-config)

- pnpm dlx @antfu/eslint-config@latest
- pick formatter

## [Install hono openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)

- ```
  pn i hono zod @hono/zod-openapi
  ```

## [stoker](https://www.npmjs.com/package/stoker?activeTab=readme): [source code](https://github.com/w3cj/stoker/tree/main)

- CJ's package for this hono project

## [Pino](https://www.npmjs.com/package/hono-pino): sophisticated logger

## [pino-pretty](https://www.npmjs.com/package/pino-pretty): make pino logger more readable

## [zod](https://zod.dev/?id=table-of-contents): provide run-time type validation

## [Scalar for Hono](https://www.npmjs.com/package/@scalar/hono-api-reference)

- Alternative for Swagger UI

## [Drizzle ORM - SqLite -Turso](https://orm.drizzle.team/docs/tutorials/drizzle-with-turso)

  ```
  pnpm add drizzle-orm @libsql/client
  pnpm add -D drizzle-kit
  ```
- The lib Sql client that Turso provide can actually talk to a file on your local machine.
- So when we are running in Dev mode, we can talk to a sqlite database living in the same folder
- When we deploy, we can create an Turso instance and then set our environment variable to be that endpoint

## LibSQL

- LibSQL is a fork of SQLite that offers a bit more functionality compared to standard SQLite
- libSQL can connect to both SQLite files and Turso remote databases

## tsconfig.json

- import with an alias, no need to do relative imports
  ```
    "paths": {
      "@/*": ["./src/*"]
    },
  ```
- we can do "import app from './app';" when
  ```
    "module": "ESNext",
    "moduleResolution": "Bundler",
  ```

## [CJ's Repo](https://github.com/w3cj/hono-open-api-starter)
