FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY frontend/ ./

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application with explicit port
CMD ["npm", "run", "start", "--", "-p", "3000"]