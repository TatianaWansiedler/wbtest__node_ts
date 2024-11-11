FROM node:18 AS setup

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD npm run dev
