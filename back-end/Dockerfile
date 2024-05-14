FROM node:18-alpine
# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat
# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV development

# Copy source code into app folder
COPY --chown=node:node . .
RUN chown -R node:node /app
# Install dependencies
RUN npm install

# Set Docker as a non-root user
USER node

# # Command để chạy ứng dụng
# CMD ["npm", "run", "start:dev"]
# Build stage
# FROM node:18-slim AS builder
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# # Production stage
# FROM node:18-slim
# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/package.json /app/package-lock.json ./
# RUN npm ci --only=production
# CMD ["node", "dist/main.js"]
