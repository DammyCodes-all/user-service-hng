# User & Authentication Microservice

This service is the single source of truth for all user data. It handles:

- User registration and login
- JWT-based authentication (access and refresh tokens)
- User profile management
- User notification preferences
- Push notification token management

## Tech Stack

- **Framework**: [Fastify](https://www.fastify.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (or any other Prisma-supported database)
- **Authentication**: [JWT](https://jwt.io/) (JSON Web Tokens)
- **Validation**: [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [pnpm](https://pnpm.io/installation) (or npm/yarn)
- A running PostgreSQL instance

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd user-service-hng
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of the project and add the following variables:

   ```env
   DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
   ACCESS_SECRET="your-access-secret"
   PORT=3000
   REFRESH_SECRET="your-refresh-secret"
   ```

4. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   The server will be running at `http://localhost:3000`.

## API Endpoints

All request and response bodies are in JSON format.

### Authentication Routes

#### `POST /register`

Registers a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "user"
}
```

**Success Response (201):**

```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  },
  "message": "User registered successfully",
  "access_token": "...",
  "refresh_token": "..."
}
```

#### `POST /login`

Logs in an existing user.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  },
  "message": "User logged in successfully",
  "access_token": "...",
  "refresh_token": "..."
}
```

#### `POST /refresh`

Refreshes an access token.

**Request Body:**

```json
{
  "token": "your-refresh-token"
}
```

**Success Response (200):**

```json
{
  "access_token": "...",
  "refresh_token": "..."
}
```

#### `POST /logout`

Logs out a user by invalidating their refresh token.

**Headers:**

- `Authorization`: `Bearer <access_token>`

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

### User Routes

All user routes require authentication.

**Headers:**

- `Authorization`: `Bearer <access_token>`

#### `GET /profile`

Gets the profile of the currently authenticated user.

**Success Response (200):**

```json
{
  "id": "clx...",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "user",
  "created_at": "2025-11-10T14:28:57.000Z",
  "preference": {
    "id": "clx...",
    "email_enabled": true,
    "push_enabled": true,
    "language": "en",
    "timezone": "UTC"
  },
  "pushTokens": [
    {
      "id": "clx...",
      "token": "...",
      "platform": "android",
      "device_name": "Pixel 8"
    }
  ]
}
```

#### `GET /profile/:id`

Gets the profile of a user by their ID.

**Success Response (200):**

(Same as `GET /profile`)

#### `GET /preference/:id`

Gets the notification preferences of a user by their ID.

**Success Response (200):**

```json
{
  "preference": {
    "id": "clx...",
    "email_enabled": true,
    "push_enabled": true,
    "language": "en",
    "timezone": "UTC"
  }
}
```

#### `POST /preference/:id`

Creates notification preferences for a user.

**Request Body:**

```json
{
  "email_enabled": true,
  "push_enabled": false,
  "language": "fr",
  "timezone": "Europe/Paris"
}
```

**Success Response (201):**

(Same as `GET /preference/:id`)

#### `PATCH /preference/:id`

Updates the notification preferences of a user.

**Request Body:**

```json
{
  "push_enabled": true
}
```

**Success Response (200):**

(Same as `GET /preference/:id`)

#### `POST /push-token`

Adds a new push notification token for the authenticated user.

**Request Body:**

```json
{
  "token": "your-push-token",
  "platform": "ios",
  "device_name": "iPhone 15"
}
```

**Success Response (201):**

```json
{
  "pushToken": {
    "id": "clx...",
    "token": "your-push-token",
    "platform": "ios",
    "device_name": "iPhone 15"
  }
}
```

#### `PATCH /push-token/:id`

Updates an existing push token.

**Request Body:**

```json
{
  "device_name": "My New iPhone"
}
```

**Success Response (200):**

(Same as `POST /push-token`)

#### `DELETE /push-token/:id`

Deletes a push token.

**Success Response (204):**

(No content)

## Environment Variables

- `DATABASE_URL`: The connection string for your PostgreSQL database.
- `ACCESS_SECRET`: A secret key for signing access tokens.
- `REFRESH_SECRET`: A secret key for signing refresh tokens.

## Scripts

- `npm run build`: Compiles the TypeScript code.
- `npm run start`: Starts the compiled application.
- `npm run dev`: Starts the application in development mode with hot-reloading.
- `pnpm test`: (Not yet implemented)
