# BACKEND docker
# Build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:linux

# Serve
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY .env ./
EXPOSE 3000
CMD ["node", "./dist/index.js"]