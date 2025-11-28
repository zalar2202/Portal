# -------- base --------
FROM node:20-alpine AS base
WORKDIR /app

# -------- deps:build (dev deps) --------
FROM base AS deps-build
COPY package*.json ./
RUN npm ci

# -------- deps:prod (runtime deps only) --------
FROM base AS deps-prod
COPY package*.json ./
RUN npm ci --omit=dev

# -------- builder --------
FROM base AS builder

ARG MONGO_URL
ARG MONGO_URI
ARG NEXT_PUBLIC_API_URL

ENV MONGO_URL=$MONGO_URL
ENV MONGO_URI=${MONGO_URI:-$MONGO_URL}
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_OPTIONS="--max-old-space-size=3072"

COPY --from=deps-build /app/node_modules ./node_modules
COPY . .
# ensure a clean prod build
RUN ls -al styles && test -f styles/styles.css
RUN npm run build && test -s .next/BUILD_ID && ls -al .next

# -------- runner --------
FROM base AS runner
ENV NODE_ENV=production

RUN apk add --no-cache curl

COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY public ./public
COPY package.json ./
COPY server.cjs ./server.cjs

EXPOSE 3000
CMD ["node", "server.cjs"]
