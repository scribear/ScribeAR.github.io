FROM node:20 AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.27

WORKDIR /app

COPY --from=builder /app/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]