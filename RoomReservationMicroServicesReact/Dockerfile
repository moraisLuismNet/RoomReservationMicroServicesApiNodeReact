# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app

# Define build arguments
ARG VITE_USER_API_URL
ARG VITE_ROOM_API_URL
ARG VITE_RESERVATION_API_URL
ARG VITE_PAYMENT_API_URL
ARG VITE_EMAIL_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Set them as environment variables for the build process
ENV VITE_USER_API_URL=$VITE_USER_API_URL
ENV VITE_ROOM_API_URL=$VITE_ROOM_API_URL
ENV VITE_RESERVATION_API_URL=$VITE_RESERVATION_API_URL
ENV VITE_PAYMENT_API_URL=$VITE_PAYMENT_API_URL
ENV VITE_EMAIL_API_URL=$VITE_EMAIL_API_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]