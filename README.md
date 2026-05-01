# Role-Based Access Control System

A full-stack application with role-based access control (RBAC) system built with React frontend and Node.js/Express backend.

## Features

- **Authentication**: Login/signup with JWT tokens
- **Role Management**: Create, edit, and delete roles
- **Permission Management**: Create, edit, and delete permissions
- **User Management**: Create, edit, and delete users with role assignments
- **Dashboard**: Overview of roles and permissions with statistics

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Lucide React (Icons)
- Axios (API calls)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## API Integration

The frontend has been fully integrated with the backend APIs:

### Authentication APIs

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Role APIs

- `GET /api/role` - Get all roles
- `POST /api/role` - Create new role
- `DELETE /api/role/:id` - Delete role
- `POST /api/role/add-permission` - Add permission to role
- `POST /api/role/remove-permission` - Remove permission from role

### Permission APIs

- `GET /api/permission` - Get all permissions
- `POST /api/permission` - Create new permission
- `PUT /api/permission/:id` - Update permission
- `DELETE /api/permission/:id` - Delete permission

### User APIs

- `POST /api/user` - Create new user
- `DELETE /api/user/:id` - Delete user
- `POST /api/user/add-role` - Add role to user
- `POST /api/user/remove-role` - Remove role from user

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or connection string)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:9000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Usage

1. Open the application in your browser at `http://localhost:5173`
2. Login with demo credentials:
   - Admin: `pooja/123456`
   - User: `user/user123`
3. Navigate through the dashboard to manage roles, permissions, and users

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {} // Optional data payload
}
```

## Error Handling

The application includes comprehensive error handling:

- Network errors are caught and displayed to users
- API errors show specific error messages
- Loading states are managed throughout the application
- Confirmation dialogs for destructive actions

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based middleware for protected routes
- CORS configuration for secure cross-origin requests
