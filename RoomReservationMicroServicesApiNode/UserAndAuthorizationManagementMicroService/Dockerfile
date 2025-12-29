# Stage 1: Build the Node.js API
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the Node.js API
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
EXPOSE 7007
CMD ["node", "dist/index.js"]