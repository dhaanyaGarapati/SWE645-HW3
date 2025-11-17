# Team Members:
# Lasya Reddy Mekala (G01473683)
# Supraja Naraharisetty (G01507868)
# Trinaya Kodavati (G01506073)
# Dhaanya S Garapati (G01512900)

FROM node:20-alpine AS build
WORKDIR /web
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=${VITE_API_BASE}
RUN npm run build


FROM nginx:alpine
COPY --from=build /web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
