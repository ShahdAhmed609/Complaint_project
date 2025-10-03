# ---------- Base ----------
FROM node:18 AS base
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# ---------- Development ----------
FROM base AS dev
CMD ["npm", "run", "dev"]

# ---------- Production ----------
FROM base AS prod
# Build the Next.js app
RUN npm run build

# Start Next.js in production mode
CMD ["npm", "run", "start"]

# Expose port for Next.js
EXPOSE 3000
