# Use the official Node.js 16 image as a parent image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or bun.lockb if using Bun)
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy the rest of your application's code
COPY . .

# Inform Docker the container listens on port 3000 at runtime
EXPOSE 3000

# Command to run the application
CMD [ "bun", "start" ]
