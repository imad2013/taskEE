# Task Management & Dashboard

A full-stack Task Management system built with Jakarta EE, Next.js 13+, TypeScript, Redux Toolkit, and WebSockets for real-time updates.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Manager, User)
  - Secure password handling

- **Task Management**
  - CRUD operations for tasks
  - Real-time updates via WebSockets
  - Task status tracking (Pending, In Progress, Completed)
  - Project assignment

- **Project Management**
  - Create and manage projects
  - Assign tasks to projects
  - Project-based task organization

- **Dashboard & Analytics**
  - Real-time task statistics
  - Project overview
  - User activity tracking

- **Real-time Updates**
  - WebSocket integration for live task updates
  - Instant UI updates across all connected clients

## 🛠 Tech Stack

### Backend
- **Jakarta EE 10** - Enterprise Java framework
- **Hibernate 6** - ORM for database operations
- **PostgreSQL** - Primary database
- **JWT** - Token-based authentication
- **WebSockets** - Real-time communication
- **Maven** - Build tool

### Frontend
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **React Redux** - React bindings for Redux
- **WebSocket Client** - Real-time updates

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai
```

### 2. Start with Docker Compose
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Jakarta EE backend on port 8080
- Next.js frontend on port 3000

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 🔧 Manual Setup

### Backend Setup
```bash
cd backend
mvn clean package
# Deploy to your Jakarta EE server (WildFly, TomEE, etc.)
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 👥 User Roles

### Admin
- Full access to all features
- User management
- Task and project deletion
- System administration

### Manager
- Create and edit tasks
- Manage projects
- View all tasks and projects
- Cannot delete tasks/projects

### User
- View assigned tasks
- Update task status
- Limited project access

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task (Admin only)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project (Admin only)

### WebSocket
- `ws://localhost:8080/ws/tasks` - Real-time task updates

## 🗄 Database Schema

### Users
- id (Primary Key)
- username (Unique)
- password (Hashed)
- roles (Many-to-Many with Role)

### Roles
- id (Primary Key)
- name (ADMIN, MANAGER, USER)

### Tasks
- id (Primary Key)
- title
- description
- status (PENDING, IN_PROGRESS, COMPLETED)
- assignedTo (Foreign Key to User)
- project (Foreign Key to Project)

### Projects
- id (Primary Key)
- name
- description

## 🔒 Security

- JWT tokens for authentication
- Role-based access control
- Password hashing (implement in production)
- CORS configuration
- Input validation

## 🚀 Deployment

### Production Deployment
1. Update environment variables
2. Configure production database
3. Set up SSL certificates
4. Deploy using Docker Compose or your preferred method

### Environment Variables
```bash
# Database
DB_URL=jdbc:postgresql://db:5432/taskdb
DB_USER=taskuser
DB_PASS=taskpass

# JWT
JWT_SECRET=your-secure-secret-key
JWT_EXPIRATION=86400000
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔄 Real-time Features

The application includes real-time updates via WebSockets:

1. **Task Updates**: When a task is created, updated, or deleted, all connected clients receive immediate updates
2. **Live Dashboard**: Dashboard statistics update in real-time
3. **Collaborative Editing**: Multiple users can work on tasks simultaneously

## 🎯 Future Enhancements

- [ ] File attachments for tasks
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile application
- [ ] Integration with external tools
- [ ] Advanced search and filtering
- [ ] Task dependencies and workflows 