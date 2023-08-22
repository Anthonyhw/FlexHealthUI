FROM node:latest as angular
WORKDIR /app
COPY package.json /app
RUN npm install --force
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=angular app/dist/flex-health-ui /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

