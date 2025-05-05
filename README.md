# Task Manager Application

A full-stack task management application with a FastAPI backend, Next.js frontend, and MongoDB database.

## Features

- Create, read, update, and delete tasks
- Task status tracking
- RESTful API
- Responsive web interface
- Containerized deployment with Docker

## Tech Stack

### Backend
- FastAPI (Python web framework)
- MongoDB (Database)
- PyMongo (MongoDB driver for Python)
- Pydantic (Data validation)
- Uvicorn (ASGI server)

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Axios (HTTP client)

### DevOps
- Docker & Docker Compose
- Environment-based configuration

## Project Structure

```
task-manager-again/
├── backend/                # FastAPI backend
│   ├── db.py               # Database connection and operations
│   ├── main.py             # API endpoints
│   ├── model_task.py       # Task data model
│   ├── pyobjectid.py       # MongoDB ObjectId utilities
│   └── Dockerfile          # Backend container configuration
├── frontend/               # Next.js frontend
│   ├── src/                # Source code
│   │   ├── app/            # Next.js app directory
│   │   │   ├── api/        # API routes
│   │   │   └── page.tsx    # Main page
│   │   └── components/     # React components
│   └── Dockerfile          # Frontend container configuration
├── docker-compose.yml      # Docker Compose configuration
├── .env                    # Environment variables (not in version control)
├── .env.example            # Example environment variables
└── requirements.txt        # Python dependencies
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- MongoDB Atlas account (or local MongoDB instance)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-manager-again.git
   cd task-manager-again
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the MongoDB connection string in the `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```

### Running with Docker

Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Development

For development without Docker:

1. Backend:
   ```bash
   cd backend
   pip install -r ../requirements.txt
   uvicorn main:app --reload
   ```

2. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints

| Method | Endpoint           | Description       |
|--------|-------------------|-------------------|
| GET    | /                 | Get all tasks     |
| POST   | /                 | Create a new task |
| PATCH  | /update/{task_id} | Update a task     |
| DELETE | /delete/{task_id} | Delete a task     |

## Task Model

```python
class Task:
    id: Optional[PyObjectId]  # MongoDB ObjectId
    name: str                 # Task name
    description: Optional[str] # Task description
    status: str               # Task status (e.g., 'pending', 'completed')
```

## Docker Configuration

The project includes Docker configuration for both development and production environments:

- `backend/Dockerfile`: Python 3.11 container for the FastAPI application
- `frontend/Dockerfile`: Node.js container for the Next.js application
- `docker-compose.yml`: Orchestrates both services with proper networking

## Environment Variables

| Variable           | Description                       | Default                  |
|--------------------|-----------------------------------|--------------------------|
| MONGODB_URI        | MongoDB connection string         | mongodb://localhost:27017 |
| PORT               | Backend server port               | 8000                     |
| NEXT_PUBLIC_API_URL| Frontend API URL                  | http://localhost:8000    |

## License

[MIT License](LICENSE)