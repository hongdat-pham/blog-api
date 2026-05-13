# Blog API

A RESTful API for managing blog posts and comments, built with a clean layered architecture using Node.js, Express, TypeScript, and PostgreSQL.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)

---

## Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Runtime    | Node.js 20+ (ESM)        |
| Framework  | Express.js               |
| Language   | TypeScript (strict mode) |
| ORM        | Prisma                   |
| Database   | PostgreSQL               |
| Validation | express-validator, Zod   |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+

### 1. Clone the repo

```bash
git clone https://github.com/hongdat-pham/blog-api.git
cd blog-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=3000
NODE_ENV=development
APP_NAME=Blog Api
API_KEY=blog-secret-key
ADMIN_KEY=my-admin-key
DATABASE_URL="postgresql://postgres:password@localhost:5432/blogdb"
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Seed the database

```bash
npx prisma db seed
```

### 6. Start the server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

Server runs at `http://localhost:3000`

---

## Authentication

All requests (except `GET /`) require the following header:

```
x-api-key: blog-secret-key
```

Missing or invalid key returns:

```json
{
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

## 📡 API Endpoints

### General

| Method | URL      | Description                      |
| ------ | -------- | -------------------------------- |
| GET    | `/`      | API info and available endpoints |
| GET    | `/stats` | Aggregated statistics            |

### Posts

| Method | URL          | Description                                |
| ------ | ------------ | ------------------------------------------ |
| GET    | `/posts`     | List posts (pagination + search)           |
| POST   | `/posts`     | Create a new post                          |
| GET    | `/posts/:id` | Get a single post with author and comments |
| PATCH  | `/posts/:id` | Update a post                              |
| DELETE | `/posts/:id` | Delete a post                              |

**Query parameters for `GET /posts`:**

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `page`    | number | Page number (default: 1)     |
| `limit`   | number | Items per page (default: 10) |
| `search`  | string | Filter by title or content   |

### Comments

| Method | URL                              | Description             |
| ------ | -------------------------------- | ----------------------- |
| GET    | `/posts/:id/comments`            | List comments on a post |
| POST   | `/posts/:id/comments`            | Add a comment to a post |
| DELETE | `/posts/:id/comments/:commentId` | Delete a comment        |

### Users

| Method | URL                | Description                                   |
| ------ | ------------------ | --------------------------------------------- |
| GET    | `/users/:id/posts` | Get all posts by a user (with comment counts) |

---

## Example Requests & Responses

### Get all posts

**Request**

```
GET /posts?page=1&limit=10
x-api-key: blog-secret-key
```

**Response `200 OK`**

```json
{
  "data": [
    {
      "id": 1,
      "title": "My first blog",
      "content": "Hello world",
      "published": true,
      "authorId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

---

### Get single post

**Request**

```
GET /posts/1
x-api-key: blog-secret-key
```

**Response `200 OK`**

```json
{
  "id": 1,
  "title": "My first blog",
  "content": "Hello world",
  "published": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "author": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "comments": [
    {
      "id": 1,
      "author": "Jane",
      "content": "Great post!",
      "createdAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

---

### Create a post

**Request**

```
POST /posts
x-api-key: blog-secret-key
Content-Type: application/json
```

```json
{
  "title": "My first blog",
  "content": "Hello world",
  "published": true,
  "authorId": 1
}
```

**Response `201 Created`**

```json
{
  "id": 1,
  "title": "My first blog",
  "content": "Hello world",
  "published": true,
  "authorId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Add a comment

**Request**

```
POST /posts/1/comments
x-api-key: blog-secret-key
Content-Type: application/json
```

```json
{
  "author": "Jane",
  "content": "Nice article!"
}
```

**Response `201 Created`**

```json
{
  "id": 1,
  "postId": 1,
  "author": "Jane",
  "content": "Nice article!",
  "createdAt": "2024-01-02T00:00:00.000Z"
}
```

---

### Get stats

**Request**

```
GET /stats
x-api-key: blog-secret-key
```

**Response `200 OK`**

```json
{
  "totalPosts": 5,
  "totalComments": 10,
  "totalUsers": 3,
  "publishedPosts": 4
}
```

---

## Error Responses

All errors follow a consistent shape:

```json
{
  "error": "Post not found",
  "statusCode": 404
}
```

| Status | Meaning                                   |
| ------ | ----------------------------------------- |
| `401`  | Unauthorized — missing or invalid API key |
| `404`  | Resource not found                        |
| `409`  | Conflict — duplicate resource             |
| `422`  | Validation error — invalid request body   |
| `500`  | Internal server error                     |

---

## Project Structure

```
blog-api/
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Migration history
│   └── seed.ts               # Seed script (3 users, 5 posts, 10 comments)
├── src/
│   ├── app.ts                # Express app setup
│   ├── server.ts             # Entry point
│   ├── config.ts             # Zod-validated environment config
│   ├── lib/
│   │   └── prisma.ts         # PrismaClient singleton
│   ├── posts/                # Feature module
│   │   ├── posts.controller.ts
│   │   ├── posts.routes.ts
│   │   ├── posts.service.ts
│   │   └── posts.validation.ts
│   ├── comments/             # Feature module
│   │   ├── comments.controller.ts
│   │   ├── comments.routes.ts
│   │   ├── comments.service.ts
│   │   └── comments.validation.ts
│   ├── users/
│   ├── stats/
│   ├── middlewares/
│   │   ├── auth.ts           # API key + admin key validation
│   │   ├── errorHandler.ts   # Global error handler
│   │   ├── logger.ts         # Request logger
│   │   └── validate.ts       # express-validator runner
│   ├── errors/               # Typed error hierarchy
│   │   ├── AppError.ts
│   │   ├── NotFoundError.ts
│   │   ├── ConflictError.ts
│   │   ├── UnauthorizedError.ts
│   │   ├── ValidationError.ts
│   │   └── index.ts
│   └── types/
│       └── express.d.ts      # Express Request augmentation (req.user)
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Available Scripts

```bash
npm run dev        # Start with hot reload (tsx watch)
npm run build      # Compile TypeScript → dist/
npm start          # Run compiled output
```
