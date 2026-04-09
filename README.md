# @roastery-capsules/post.post-type

Post type management capsule for the [Roastery CMS](https://github.com/roastery-cms) ecosystem.

[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

## Overview

**@roastery-capsules/post.post-type** is an [Elysia](https://elysiajs.com) capsule that provides full CRUD management for post types, including TypeBox schema definition, automatic slug generation, uniqueness validation, highlighting, pagination, and optional Redis caching.

It exposes `PostTypeRoutes`, an Elysia plugin ready to be mounted in your application, with the following endpoints:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/post-types/` | Required | Create a new post type |
| `GET` | `/post-types/` | Public | List post types (paginated) |
| `GET` | `/post-types/highlights` | Public | List highlighted post types (paginated) |
| `GET` | `/post-types/:id-or-slug` | Public | Get post type by ID or slug |
| `PATCH` | `/post-types/:id-or-slug` | Required | Update a post type |
| `DELETE` | `/post-types/:id-or-slug` | Required | Delete a post type |

## Technologies

| Tool | Purpose |
|------|---------|
| [Elysia](https://elysiajs.com) | HTTP framework and plugin target |
| [@roastery/barista](https://github.com/roastery-cms) | Elysia application factory |
| [@roastery/terroir](https://github.com/roastery-cms) | Runtime schema validation and exception handling |
| [@roastery/beans](https://github.com/roastery-cms) | Domain entity base class |
| [@roastery/seedbed](https://github.com/roastery-cms) | Repository and use-case contracts |
| [@roastery-adapters/post](https://github.com/roastery-cms) | Prisma post type repository adapter |
| [@roastery-adapters/cache](https://github.com/roastery-cms) | Redis caching adapter |
| [@roastery-capsules/auth](https://github.com/roastery-cms) | Authentication plugin |
| [Prisma](https://www.prisma.io) | ORM for data persistence |
| [tsup](https://tsup.egoist.dev) | Bundling to ESM + CJS with `.d.ts` generation |
| [Bun](https://bun.sh) | Runtime, test runner, and package manager |
| [Knip](https://knip.dev) | Unused exports and dependency detection |
| [Husky](https://typicode.github.io/husky) + [commitlint](https://commitlint.js.org) | Git hooks and conventional commit enforcement |

## Installation

```bash
bun add @roastery-capsules/post.post-type
```

**Peer dependencies** (install alongside):

```bash
bun add @types/bun tsup typescript
```

---

## Usage

```typescript
import { Elysia } from 'elysia';
import { PostTypeRoutes } from '@roastery-capsules/post.post-type/presentation';

const app = new Elysia()
  .use(PostTypeRoutes({ repository }))
  .listen(3000);
```

### Post type entity

Each `PostType` has the following properties:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Display name (e.g. `"review"`, `"blog-post"`) |
| `slug` | `string` | URL-friendly identifier (auto-generated from name) |
| `schema` | `string` | Serialized TypeBox schema defining the post's structure |
| `isHighlighted` | `boolean` | Highlight flag (default: `false`) |

### Creating a post type

```http
POST /post-types/
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Review",
  "schema": "<serialized TypeBox schema via SchemaManager>"
}
```

### Listing post types

```http
GET /post-types/?page=1&limit=10
```

### Listing highlighted post types

```http
GET /post-types/highlights?page=1&limit=10
```

### Getting a post type by ID or slug

```http
GET /post-types/review
GET /post-types/<uuid>
```

### Updating a post type

```http
PATCH /post-types/review
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Book Review",
  "slug": "book-review",
  "isHighlighted": true
}
```

### Deleting a post type

```http
DELETE /post-types/review
Authorization: Bearer <token>
```

---

## Development

```bash
# Run tests
bun run test:unit

# Run tests with coverage
bun run test:coverage

# Build for distribution
bun run build

# Check for unused exports and dependencies
bun run knip

# Full setup (build + bun link)
bun run setup
```

## License

MIT
