FROM node:18-alpine

ARG CMD_COMMAND="npm start"
ENV CMD_COMMAND=${CMD_COMMAND}

WORKDIR /app

COPY package.json ./

RUN npm install

COPY index.js .

EXPOSE 3000

CMD ["sh", "-c", "$CMD_COMMAND"]
