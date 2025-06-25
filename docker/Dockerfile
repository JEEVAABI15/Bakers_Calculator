# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY src/server ./src/server
EXPOSE 3001
CMD ["node", "src/server/server.js"] 