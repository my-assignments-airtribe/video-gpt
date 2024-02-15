# Use the official Bun image as a parent image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and bun.lockb into the working directory
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of your application's code into the container
COPY . .

# Inform Docker that the container listens on port 3000 at runtime
EXPOSE 3000

# Command to run the application using Bun
CMD ["bun", "start"]
