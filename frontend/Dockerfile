FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN ls -la /app

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx/config /etc/nginx/conf.d/default.conf
COPY ./nginx/config /tmp/nginx_config_debug
RUN ls -la /tmp
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
