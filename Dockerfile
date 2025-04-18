# Step 1: Build the app
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the app using webpack
RUN npm run build

# Step 2: Serve with nginx
FROM nginx:alpine

# Copy compiled dist to nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
