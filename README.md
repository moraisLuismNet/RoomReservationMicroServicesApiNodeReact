# RoomReservationMicroServicesApiNodeReact

A full-stack application for managing room reservations, featuring a React frontend and a Node.js/Express backend API with PostgreSQL database.

## Project Structure

- `RoomReservationMicroServicesReact/`: React frontend application (runs on port 4200)
- `RoomReservationMicroServicesApiNode/`: Node.js/Express backend API (runs on port 7007)
- `docker-compose.yml`: Docker composition for local development (Frontend, Backend, and PostgreSQL)

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js 18+ (for local development)

## Getting Started

To start the entire system (Frontend, Backend, and Database):

```bash
npm start
```

This will run `docker-compose up -d` and open the application in your browser at http://localhost:4200/.

### Development Commands

- **Start with Docker**: `npm start`
- **Start locally (No Docker)**: `npm run dev` (Requires local PostgreSQL)
- **Stop Docker**: `npm stop`
- **Rebuild Docker**: `npm run rebuild`
- **View Docker logs**: `npm run logs`

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, FullCalendar
- **Backend**: Node.js, Express, TypeScript, TypeORM, JWT Authentication
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose
- **Additional**: Stripe for payments, Winston for logging

## docker-compose.yml

The application uses Docker Compose to orchestrate three services:

```yaml
services:
  roomreservationapi:
    build:
      context: ./RoomReservationMicroServicesApiNode
      dockerfile: Dockerfile
    ports:
      - "7007:7007"
    environment:
      - NODE_ENV=development
      - PORT=7007
      - DATABASE_URL=postgresql://postgres:YourStrongPassword123!@postgres:5432/RoomReservationDb
    env_file:
      - ./RoomReservationMicroServicesApiNode/.env
    depends_on:
      - postgres
    networks:
      - roomreservationnet

  roomreservationreact:
    build:
      context: ./RoomReservationMicroServicesReact
      dockerfile: Dockerfile
    ports:
      - "4200:80"
    environment:
      - NODE_ENV=development
    depends_on:
      - roomreservationapi
    networks:
      - roomreservationnet

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=YourStrongPassword123!
      - POSTGRES_DB=RoomReservationDb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - roomreservationnet

volumes:
  postgres_data:

networks:
  roomreservationnet:
    driver: bridge
```

## Dockerfiles

### Backend Dockerfile (RoomReservationMicroServicesApiNode/Dockerfile)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS stage-1
WORKDIR /app
RUN npm install --production
COPY --from=build /app/dist ./dist
EXPOSE 7007
CMD ["npm", "start"]
```

### Frontend Dockerfile (RoomReservationMicroServicesReact/Dockerfile)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS stage-1
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Rooms

- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create new room (admin)
- `PUT /api/rooms/:id` - Update room (admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Reservations

- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/:id` - Get reservation by ID
- `POST /api/reservations` - Create new reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Delete reservation

### Users

- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=7007
DATABASE_URL=postgresql://postgres:YourStrongPassword123!@postgres:5432/RoomReservationDb
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h
```

## Database Schema

The application uses the following main entities:

- **Users**: User authentication and profile information
- **Rooms**: Room details and availability
- **Reservations**: Booking information with dates and user associations

[DeepWiki moraisLuismNet/RoomReservationMicroServicesApiNodeReact](https://deepwiki.com/moraisLuismNet/RoomReservationMicroServicesApiNodeReact)

## RoomReservationMicroServicesApiNode

<kbd>
  <img src="RoomReservationMicroServicesApiNode/img/PaymentMicroService.png" width="60%" height="60%" alt="PaymentMicroService">
</kbd>  
<kbd>
  <img src="RoomReservationMicroServicesApiNode/img/ReservationsMicroService.png" width="60%" height="60%" alt="ReservationsMicroService">
</kbd>  
<kbd>
  <img src="RoomReservationMicroServicesApiNode/img/RoomMicroService.png" width="60%" height="60%" alt="RoomMicroService">
</kbd>  
<kbd>
  <img src="RoomReservationMicroServicesApiNode/img/SendEmailsMicroService.png" width="60%" height="60%" alt="SendingEmailsMicroService.png">
</kbd>  
<kbd>
  <img src="RoomReservationMicroServicesApiNode/img/UserAndAuthorizationManagementMicroService.png" width="60%" height="60%" alt="UserAndAuthorizationManagementMicroService">
</kbd>  

## RoomReservationMicroServicesReact

| | | |
| :---: | :---: | :---: |
| <kbd><img src="RoomReservationMicroServicesReact/img/01.png" width="60%" height="90%" alt="RoomReservationMicroServicesReact_01"></kbd> | <kbd><img src="RoomReservationMicroServicesReact/img/02.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_02"></kbd> | <kbd><img src="RoomReservationMicroServicesReact/img/03.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_03"></kbd> |
| <kbd><img src="RoomReservationMicroServicesReact/img/04.png" width="80%" height="90%" alt="RoomReservationMicroServicesReact_04"></kbd> | <kbd><img src="RoomReservationMicroServicesReact/img/05.png" width="70%" height="90%" alt="RoomReservationMicroServicesReact_05"></kbd> | <kbd><img src="RoomReservationMicroServicesReact/img/06.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_06"></kbd> |
| <kbd><img src="RoomReservationMicroServicesReact/img/07.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_07"></kbd> | <kbd><img src="RoomReservationMicroServicesReact/img/08.png" width="60%" height="90%" alt="RoomReservationMicroServicesReact_08"></kbd> | <kbd><img src="RoomReservationMicroServicesReact/img/09.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_09"></kbd> |
| <kbd><img src="RoomReservationMicroServicesReact/img/10.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_10"></kbd> | <kbd><img src="RoomReservationMicroServicesReact/img/11.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_11"></kbd> | <kbd><img src="RoomReservationMicroServicesReact/img/12.png" width="60%" height="90%" alt="RoomReservationMicroServicesReact12"></kbd> |
| <kbd><img src="RoomReservationMicroServicesReact/img/13.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_13"></kbd> |


## Development

### Local Development Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd RoomReservationApiNodeReact
```

2. Start the services:

```bash
npm start
```

3. Access the application:

- Frontend: http://localhost:4200
- Backend API: http://localhost:7007
- Database: localhost:5432

### Backend Development

Navigate to the backend directory:

```bash
cd RoomReservationApiNode
npm install
npm run dev
```

### Frontend Development

Navigate to the frontend directory:

```bash
cd RoomReservationReact
npm install
npm run dev
```

## Features

### User Authentication

- User registration and login
- JWT-based authentication
- Role-based access control (admin/user)

### Room Management

- Create, view, and update rooms
- Room availability checking
- Room search and filtering

### Reservation System

- Create and manage reservations
- Calendar view for reservations
- Conflict detection and prevention
- Reservation history

### Administration

- User management
- Room management
- Reservation oversight
- System monitoring

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 4200, 7007, and 5432 are available
2. **Database connection**: Check PostgreSQL container is running
3. **Build errors**: Clear Docker cache with `docker system prune`

### Logs

View logs for all services:

```bash
npm run logs
```

View logs for specific service:

```bash
docker-compose logs roomreservationapi
docker-compose logs roomreservationreact
docker-compose logs postgres
```
