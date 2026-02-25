# Task Management System

A full-stack task management application built with ASP.NET, Angular, and PostgreSQL. Features include task CRUD operations, status filtering, and pagination.

## Architecture

### Backend
- **Clean Architecture**: Separation of concerns with Application, Domain, and Infrastructure layers
- **Repository Pattern**: Abstracted via EF Core DbContext
- **DTO Pattern**: Decoupling API contracts from domain models
- **Global Exception Handling**: Centralized error handling middleware
- **Entity Framework Core**: Code-first approach with migrations

### Frontend
- **Standalone Components**: Modern Angular architecture (no NgModules)
- **Reactive Programming**: RxJS observables for state management

### Infrastructure
- **Docker Multi-stage Builds**: Optimized image sizes
- **Nginx as Reverse Proxy**: Serves static files and proxies API requests
- **Health Checks**: PostgreSQL health verification
- **Container Networking**: Isolated bridge network for service communication

## Running Locally

1. **Clone the repository**
   ```bash
   cd TaskManagement
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start all services**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - **Web UI**: http://localhost
   - **API**: http://localhost:5000
   - **Database**: localhost:5432