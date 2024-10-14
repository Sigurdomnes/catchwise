# Stage 1: build
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

# Stage 2: run
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app /app
EXPOSE 3000

CMD ["npm", "run", "start"]

# Stage 3: server
FROM nginx:alpine AS nginx

COPY --from=builder /app/.next/static /usr/share/nginx/html/_next/static
COPY --from=builder /app/src/public/favicon.ico /usr/share/nginx/html/favicon.ico

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]