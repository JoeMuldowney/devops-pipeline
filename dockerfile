# Use a Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /reactapp

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Set the command to run the React app
CMD ["npm", "start"]