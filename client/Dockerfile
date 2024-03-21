FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm install -g serve

RUN npm run build

FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/sites-enabled/default

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
