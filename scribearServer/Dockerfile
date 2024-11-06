FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

WORKDIR /app/build/src

CMD ["node", "index.js"]