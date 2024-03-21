FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html
COPY /etc/letsencrypt/options-ssl-nginx.conf /etc/letsencrypt/
COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
