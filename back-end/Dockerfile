
# # Sử dụng node 18-alpine làm base image
# FROM node:18-alpine

# # Thêm các thư viện chia sẻ thiếu từ alpine base image
# RUN apk add --no-cache libc6-compat

# # Tạo thư mục app trong container
# WORKDIR /app

# # Set môi trường là development
# ENV NODE_ENV=development

# # Sao chép mã nguồn vào thư mục app trong container
# COPY --chown=node:node . .

# # Chuyển quyền sở hữu của thư mục app cho user node
# RUN chown -R node:node /app

# # Chuyển user sang node để chạy ứng dụng
# USER node

# # Cài đặt dependencies
# RUN npm install

# # Command để chạy ứng dụng
# CMD ["npm", "run", "start:dev"]
# Build stage
FROM node:18-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --only=production
CMD ["node", "dist/main.js"]
