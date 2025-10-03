# Use Node.js base image
FROM node:18

# Set working directory (match the folder where package.json lives)
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend project
COPY . .

# Expose the port
EXPOSE 3000

# Start the frontend
CMD ["npm", "run", "dev"]
