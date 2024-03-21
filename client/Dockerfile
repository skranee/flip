FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 80

EXPOSE 443

CMD ["server", "-s", "build", "-l", "80"]