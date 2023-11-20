FROM node:18-alpine

WORKDIR /app

VOLUME ./uploads

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]