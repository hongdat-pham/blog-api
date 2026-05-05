# Blog API

A simple REST API to manage your blog, built with **Node.js** and **Express.js** .

## Tech Stack

- Node.js (ESM)
- Express.js
- File-based storage (JSON)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/hongdat-pham/blog-api.git
cd blog-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=3000
NODE_ENV=development
APP_NAME=Blog API
API_KEY=blog-secret-key
```

### 4. Run the server

```bash
npm run dev
```

Server will be running at `http://localhost:3000`

---

## Authentication

All requests (except `GET /`) must include the following header:

```
x-api-key: blog-secret-key
```

Without this header, the API will return `401 Unauthorized`.

---

## API Endpoints

### General

| Method | URL | Description                      |
| ------ | --- | -------------------------------- |
| GET    | `/` | API info and available endpoints |

### Posts

| Method | URL                     | Body / Headers                   | Description                   |
| ------ | ----------------------- | -------------------------------- | ----------------------------- |
| POST   | `/posts`                | `x-api-key`,`{title, content}`   | Create new post               |
| GET    | `/posts`                | `x-api-key`                      | Get all posts                 |
| GET    | `/posts?search=keyword` | `x-api-key`                      | Search posts by title/content |
| GET    | `/posts?page=1&limit=5` | `x-api-key`                      | Get posts with pagination     |
| GET    | `/posts/:id`            | `x-api-key`                      | Get single post               |
| PATCH  | `/posts/:id`            | `x-api-key`,`{title?, content?}` | Update post                   |
| DELETE | `/posts/:id`            | `x-api-key`                      | Delete post                   |

### Comments

| Method | URL                              | Body / Headers                  | Description            |
| ------ | -------------------------------- | ------------------------------- | ---------------------- |
| POST   | `/posts/:id/comments`            | `x-api-key`,`{author, content}` | Add comment to a post  |
| GET    | `/posts/:id/comments`            | `x-api-key`                     | Get comments of a post |
| DELETE | `/posts/:id/comments/:commentId` | `x-api-key`                     | Delete a comment       |

---

## Data Models

### Post Object

```json
{
  "id": 1700000000000,
  "title": "My first blog",
  "content": "Hello world",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Comment Object

```json
{
  "id": 1700000000001,
  "postId": 1700000000000,
  "author": "John",
  "content": "Great post!",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Example Requests (Postman)

### Create a Post

```
Method: POST
URL:    http://localhost:3000/posts
Headers:
  Content-Type: application/json
  x-api-key:    blog-secret-key
Body:
  {
    "title": "My first blog",
    "content": "Hello world"
  }
```

### Get All Posts

```
Method: GET
URL:    http://localhost:3000/posts
Headers:
  x-api-key: blog-secret-key
```

### Add a Comment

```
Method: POST
URL:    http://localhost:3000/posts/1700000000000/comments
Headers:
  Content-Type: application/json
  x-api-key:    blog-secret-key
Body:
  {
    "author": "Jane",
    "content": "Nice article!"
  }
```

---

## Error Responses

| Status | Meaning                                   |
| ------ | ----------------------------------------- |
| 401    | Unauthorized — missing or invalid API key |
| 404    | Resource not found                        |
| 422    | Validation error — invalid request body   |
| 500    | Internal server error                     |

---

## Project Structure

```
blog-api/
├── src/
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   ├── config.js           # Environment config
│   ├── data/
│   │   └── db.js           # File-based data store
│   ├── posts/
│   │   ├── posts.controller.js
│   │   ├── posts.model.js
│   │   ├── posts.routes.js
│   │   └── posts.service.js
│   ├── comments/
│   │   ├── comments.controller.js
│   │   ├── comments.model.js
│   │   ├── comments.routes.js
│   │   └── comments.service.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── validate.js
│   └── errors/
│       └── AppError.js
├── data/
│   ├── posts.json          # Posts storage
│   └── comments.json       # Comments storage
├── .env                    # Environment variables (not committed)
├── .gitignore
└── package.json
```
