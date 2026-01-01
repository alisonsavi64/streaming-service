FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash git
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:20-alpine AS prod
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
