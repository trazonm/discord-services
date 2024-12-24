# Use an official Node.js image as the base image
FROM node:18-slim

# Install necessary dependencies for Chromium
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to install dependencies
COPY package*.json ./

# Install dependencies, including playwright and other dependencies
RUN npm install --production && npx playwright install

# Copy the rest of the application code
COPY . .

# Expose port 6001 (adjust if needed)
EXPOSE 6001

# Start the application with nodemon (note: this is for development purposes)
CMD ["npm", "start"]
