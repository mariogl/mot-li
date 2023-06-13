FROM node:19-alpine
WORKDIR /app
COPY package.json ./
RUN npm i
COPY . .
CMD ["npm run build"]


