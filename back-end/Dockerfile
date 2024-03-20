FROM node:18-alpine
# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat
# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV development

# Copy source code into app folder
COPY --chown=node:node . .

# Install dependencies
RUN npm install

# Set Docker as a non-root user
USER node