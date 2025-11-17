# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /web
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=${VITE_API_BASE}
RUN npm run build

# --- serve stage ---
FROM nginx:alpine
COPY --from=build /web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
