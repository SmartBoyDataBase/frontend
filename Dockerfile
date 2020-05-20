FROM node:alpine as builder
COPY . /sbdb-frontend
WORKDIR /sbdb-frontend
RUN yarn && yarn build

FROM nginx:alpine
COPY --from=builder /sbdb-frontend/build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g daemon off;"]
EXPOSE 80
