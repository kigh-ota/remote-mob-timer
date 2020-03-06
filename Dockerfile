FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV USE_IN_MEMORY_STORE 1
CMD ["node", "./bin/www"]