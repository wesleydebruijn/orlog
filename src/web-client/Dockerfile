FROM node:14.15-alpine as build

WORKDIR /usr/src/app
COPY src/web-client/package*.json ./
RUN yarn cache clean && yarn --update-checksums
COPY src/web-client/. ./
RUN yarn && yarn build

# Stage - Production
FROM nginx:1.17-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]