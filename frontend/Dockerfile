# Stage 1: Build the React app
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

# Copy the build output from the previous stage to the nginx html folder
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 to serve the application
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
