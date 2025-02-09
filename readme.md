# Todo App API

This is a RESTful API for a Todo App built with Node.js, Express, and MongoDB. The app is designed for teams to manage tasks collaboratively.

## Table of Contents

- [Todo App API](#todo-app-api)
  - [Table of Contents](#table-of-contents)
  - [Endpoints](#endpoints)
    - [Users](#users)
    - [Tasks](#tasks)
    - [Categories](#categories)
    - [Groups](#groups)
    - [Task Assignments](#task-assignments)
  - [Authentication](#authentication)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
  - [License](#license)

## Endpoints

### Users

- `POST /api/v1/auth/signup`: Create a new user
- `POST /api/v1/auth/signin`: Sign in an existing user
- `POST /api/v1/auth/forget-password`: Forgot password
- `POST /api/v1/auth/verifyResetCode`: Verify password reset code
- `POST /api/v1/auth/resetPassword`: Reset password
- `POST /api/v1/auth/refresh-token`: Refresh access token
- `POST /api/v1/auth/logout`: Logout user

### Tasks

- `GET /api/v1/tasks`: Get all tasks
- `POST /api/v1/tasks`: Create a new task
- `GET /api/v1/tasks/:id`: Get a task by ID
- `PUT /api/v1/tasks/:id`: Update a task
- `PUT /api/v1/tasks/:id/complete`: Mark a task as complete
- `DELETE /api/v1/tasks/:id`: Delete a task

### Categories

- `GET /api/v1/categories`: Get all categories
- `POST /api/v1/categories`: Create a new category
- `GET /api/v1/categories/:id`: Get a category by ID
- `PUT /api/v1/categories/:id`: Update a category
- `DELETE /api/v1/categories/:id`: Delete a category

### Groups

- `GET /api/v1/groups`: Get all groups
- `POST /api/v1/groups`: Create a new group
- `GET /api/v1/groups/:groupId`: Get a group by ID
- `PUT /api/v1/groups/:groupId`: Update a group
- `DELETE /api/v1/groups/:groupId`: Delete a group
- `POST /api/v1/groups/:groupId/join-link`: Generate a join link for a group
- `GET /api/v1/groups/join/:token`: Join a group using a join link

### Task Assignments

- `POST /api/v1/assignments`: Assign a task to a user
- `GET /api/v1/assignments`: Get all tasks assigned to the logged-in user
- `GET /api/v1/assignments/:id`: Get a specific task assignment by ID
- `DELETE /api/v1/assignments/:id`: Delete a task assignment

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. The JWT is returned in the response of the `POST /api/v1/auth/signin` endpoint and should be included in the `Authorization` header of subsequent requests.

## Environment Variables

The API requires the following environment variables:

- `DATABASE`: The MongoDB connection string
- `DATABASE_PASSWORD`: The MongoDB database password
- `DATABASE_NAME`: The MongoDB database name
- `JWT_SECRET_KEY`: The secret key used to sign the JWT
- `JWT_EXPIRES_IN`: The duration of the JWT in seconds
- `JWT_REFRESH_SECRET_KEY`: The secret key used to sign the refresh token
- `JWT_REFRESH_EXPIRES_IN`: The duration of the refresh token in seconds
- `SMTP_EMAIL`: The SMTP email address for sending emails
- `SMTP_PASSWORD`: The SMTP email password
- `SMTP_HOST`: The SMTP host (default: smtp.gmail.com)
- `SMTP_PORT`: The SMTP port (default: 587)
- `PASSWORD_RESET_EXPIRATION`: The duration for password reset code expiration in milliseconds (default: 600000)
- `SEED_ON_STARTUP`: Boolean to seed predefined categories on startup (default: false)

## Installation

1. Clone the repository
   ```sh
   git clone https://github.com/your-username/todoApp-Express.git
   ```
2. Navigate to the project directory
   ```sh
   cd todoApp-Express
   ```
3. Install dependencies
   ```sh
   npm install
   ```
4. Set up environment variables by creating a `.env` file in the root directory and adding the required values.
5. Start the server
   ```sh
   npm run dev
   ```

## Usage

Once the server is running, you can access the API via `http://localhost:5000/api/v1/`.

Example request to get all tasks:

```sh
curl -X GET http://localhost:5000/api/v1/tasks -H "Authorization: Bearer <your_token>"
```

## Project Structure

The `todoApp-Express` folder contains the following structure:

```
todoApp-Express/
│-- config/           # Configuration files (database, environment variables)
│-- controllers/      # API route controllers
│-- middlewares/      # Middleware functions
│-- models/           # Mongoose models
│-- routes/           # Express routes
│-- utils/            # Utility functions (error handling, JWT, etc.)
│-- views/            # EJS templates (if using SSR)
│-- .env              # Environment variables (not committed to GitHub)
│-- app.js            # Main Express app setup
│-- server.js         # Entry point to start the server
│-- package.json      # Dependencies and scripts
```

## License

This project is licensed under the MIT License.
