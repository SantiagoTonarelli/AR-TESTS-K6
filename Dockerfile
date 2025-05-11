
# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
# This includes devDependencies needed for the build process (e.g., typescript)
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the TypeScript application
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable (already handled in server.ts and docker-compose.yml, but good for explicitness if needed)
# ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]