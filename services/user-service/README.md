# User Service Setup & Deployment

## Local Setup

### Install Dependencies

To install the project dependencies, run the following command:

```bash
bun install
```

### Start the Service

To start the service locally, use:

```bash
bun start
```

## Using Docker

### Start the Database

First, launch a PostgreSQL database container by running:

```bash
docker run --name postgres-user-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### Build the Docker Image

```bash
docker build -t user-service .
```

### Run the Docker Container
To run the user service container with the correct environment variables for the database connection, use the following command. Make sure to replace `password` with your actual database password.


```bash
docker run -p 3000:3000 -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_USER=postgres -e DB_PASSWORD=password -e DB_NAME=usersdb user-service
```
Note: In the command to run the container, ensure the database password (DB_PASSWORD) matches the one you set when starting the PostgreSQL container.

## Running Tests

To run the tests, use the following command:

```bash
bun debug:testcontainers
```