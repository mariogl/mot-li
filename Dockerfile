FROM node:19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build -- --base=/mot-li/
CMD ["echo", "build done"]
