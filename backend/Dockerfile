FROM node:24.14.1-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24.14.1-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev && npm install pm2 -g

USER node

EXPOSE 3000

CMD ["pm2-runtime", "dist/app.js", "-i", "max", "--node-args", "--max-old-space-size=1536"]