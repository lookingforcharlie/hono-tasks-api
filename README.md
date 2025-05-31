# Hono Backend Project: [CJ's Repo](https://github.com/w3cj/hono-open-api-starter)

- [Inspired by](https://www.youtube.com/watch?v=sNh9PoM9sUE)

- A pure json api

## Setup

- Clone this template without git history ( You might need to install degit )

  ```
  npx degit lookingforcharlie/hono-tasks-api my-hono-tasks-api
  ```

- Create .env file and update file:example.db in .env to file:dev.db

  ```
  cp .env.example .env
  ```

- Create .env.test file and update file:example.db in .env to file:test.db

  ```
  cp .env.example .env.test
  ```

- Install dependencies

  ```
  pnpm install
  ```

- Create sqlite db / push schema

  ```
  pnpm drizzle-kit push
  ```

- Run App

  ```
  pnpm dev
  ```

- Run drizzle studio

  ```
  pnpm drizzle-kit studio
  ```

- Run Lint

  ```
  pnpm lint
  ```

- Run Test

  ```
  pnpm test
  ```

## Endpoints

| Path               | Description              |
| ------------------ | ------------------------ |
| GET /doc           | Open API Specification   |
| GET /reference     | Scalar API Documentation |
| GET /tasks         | List all tasks           |
| POST /tasks        | Create a task            |
| GET /tasks/{id}    | Get one task by id       |
| PATCH /tasks/{id}  | Patch one task by id     |
| DELETE /tasks/{id} | Delete one task by id    |

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
- Vercel doesn't support "paths": { "@/_": ["./src/_"] }

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

## [Zod to OpenAPI](https://www.npmjs.com/package/@asteasolutions/zod-to-openapi)

- We need this library for using jsonContentOneOf helper function from stoker to turn anyOf to oneOf

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

## [Drizzle zod](https://orm.drizzle.team/docs/zod)

- drizzle-zod is a plugin for Drizzle ORM that allows you to generate Zod schemas from Drizzle ORM schemas.
- pnpm add drizzle-zod

## [Hono Test](https://hono.dev/docs/guides/testing)

- Hono has request built-in method, doesn't need a separate library: router.request('url')
- not like Express, you need superTest library

## vitest

- pn i -D vitest
- pn i -D @vitest/coverage-v8
- "test": "vitest" in package.json: search the whole directory for any file that has the word 'test' inside of it

## Generate my tasks API SDK
