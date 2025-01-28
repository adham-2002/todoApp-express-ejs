## Todo App API

This is a RESTful API for a Todo App built with Node.js, Express, and MongoDB.

### Endpoints

#### Users

- `POST /api/v1/auth/signup`: Create a new user
- `POST /api/v1/auth/signin`: Sign in an existing user
- `POST /api/v1/auth/forget-password`: Forgot password
- `POST /api/v1/auth/verifyResetCode`: Verify password reset code
- `POST /api/v1/auth/resetPassword`: Reset password

#### Tasks

- `GET /api/v1/tasks`: Get all tasks
- `POST /api/v1/tasks`: Create a new task
- `GET /api/v1/tasks/:id`: Get a task by ID
- `PUT /api/v1/tasks/:id`: Update a task
- `DELETE /api/v1/tasks/:id`: Delete a task

#### Categories

- `GET /api/v1/categories`: Get all categories
- `POST /api/v1/categories`: Create a new category
- `GET /api/v1/categories/:id`: Get a category by ID
- `PUT /api/v1/categories/:id`: Update a category
- `DELETE /api/v1/categories/:id`: Delete a category

### Authentication

The API uses JSON Web Tokens (JWT) for authentication. The JWT is returned in the response of the `POST /api/v1/auth/signin` endpoint and should be included in the `Authorization` header of subsequent requests.

### Environment Variables

The API requires the following environment variables:

- `MONGO_URI`: The MongoDB connection string
- `JWT_SECRET_KEY`: The secret key used to sign the JWT
- `JWT_EXPIRES_IN`: The duration of the JWT in seconds
- `JWT_REFRESH_SECRET_KEY`: The secret key used to sign the refresh token
- `JWT_REFRESH_EXPIRES_IN`: The duration of the refresh token in seconds

### Installation

1. Clone the repository
2. Install the dependencies with `npm install`
3. Start the server with `npm start`

### Usage

1. Sign up a new user with `POST /api/v1/auth/signup`
2. Sign in the user with `POST /api/v1/auth/signin`
3. Create a new task with `POST /api/v1/tasks`
4. Get all tasks with `GET /api/v1/tasks`
5. Get a task by ID with `GET /api/v1/tasks/:id`
6. Update a task with `PUT /api/v1/tasks/:id`
7. Delete a task with `DELETE /api/v1/tasks/:id`

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
