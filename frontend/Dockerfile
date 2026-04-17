# # ========================
# # Stage 1: Builder
# # ========================
# FROM node:20-alpine AS builder

# WORKDIR /app

# # Copy only dependency files first (better cache)
# COPY package.json package-lock.json ./
# RUN npm ci

# # Copy rest of the source code
# COPY . .

# # Build Next.js app
# RUN npm run build

# # ========================
# # Stage 2: Runner
# # ========================
# FROM node:20-alpine

# WORKDIR /app
# ENV NODE_ENV=production

# # Copy only required build output
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/package-lock.json ./package-lock.json

# # Install only prod deps
# RUN npm ci --omit=dev

# EXPOSE 3000
# CMD ["npm", "start"]


# ========================
# Stage 1: Builder
# ========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only dependency files first (better cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of the source code
COPY . .

# Build Next.js app
RUN npm run build

# ========================
# Stage 2: Runner
# ========================
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy only required build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only prod deps
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
