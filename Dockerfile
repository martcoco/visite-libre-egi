FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY public ./public
RUN mkdir -p data
EXPOSE 3000
CMD ["node", "src/server.js"]
