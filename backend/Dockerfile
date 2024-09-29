# Stage 1: Build the application
FROM node:20.5.1 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching purposes)
COPY package*.json ./

# Clean npm cache to avoid "Tracker 'idealTree' already exists" error
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app will run on
EXPOSE 3366

# Command to run the app
CMD ["node", "server.js"]
