FROM node:18

WORKDIR /app

RUN npm install -g tsx

COPY package*.json ./

RUN npm install

COPY . .

CMD ["tsx", "/app/cronjob/cron.ts"]
