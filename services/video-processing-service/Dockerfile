# syntax=docker/dockerfile:1

FROM node:18.15.0

# Use production node environment by default.
ENV NODE_ENV production

# Set working directory inside the container
WORKDIR /usr/src/app

# Install Python and other dependencies required by youtube-dl-exec
# Debian-based images use apt-get as the package manager
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    python3 -m pip install --no-cache-dir --upgrade pip setuptools

# Copy package.json and yarn.lock files into the image
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Switch to non-root user for security
USER node

# Copy the rest of the application source code
COPY --chown=node:node . .

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["yarn", "start"]
