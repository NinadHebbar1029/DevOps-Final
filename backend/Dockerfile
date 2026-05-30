FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# install build deps and compile
COPY backend/package.json backend/package-lock.json* ./
RUN npm install
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production

WORKDIR /usr/src/app

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# copy only what we need for runtime and install production deps
COPY backend/package.json ./
RUN npm install --omit=dev --no-audit --no-fund --silent

# copy built artifacts
COPY --from=builder /usr/src/app/dist ./dist

# set permissions and switch to non-root
RUN chown -R appuser:appgroup /usr/src/app
USER appuser

EXPOSE 4000
ENV PORT=4000

# lightweight healthcheck for orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

CMD ["node", "dist/index.js"]