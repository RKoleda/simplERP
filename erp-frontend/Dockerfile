# erp-frontend/Dockerfile
FROM node:22

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Static file server
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist"]
