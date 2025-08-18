# Stage 1: Build React App
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the built app with nginx
FROM nginx:alpine

# Copy the build folder to nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
