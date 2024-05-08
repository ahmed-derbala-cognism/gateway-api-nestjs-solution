# Use Node.js image as base
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm run clean 

RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to start the app using PM2 with maximum instances
CMD ["pm2", "start", "npm", "--", "start", "-i", "max"]
