FROM node:20-alpine AS build

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3000"]