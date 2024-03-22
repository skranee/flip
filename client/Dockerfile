FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

#RUN npm install -g serve

FROM nginx

EXPOSE 3000

COPY --from=build /app/build /usr/share/nginx/html

#CMD ["serve", "-s", "build", "-l", "3000"]