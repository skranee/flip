FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm install -g serve

RUN npm run build

EXPOSE 80

EXPOSE 443

CMD ["serve", "-s", "build", "-l", "80"]
