FROM node:20-alpine3.19

RUN apk update && apk add bash
RUN apk add --no-cache g++ make
RUN apk add python3
WORKDIR /app

COPY . .

RUN npm install pm2 -g
RUN npm install
RUN npm run build

EXPOSE 4000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]