FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN chmod +x /usr/src/app/wait-for-it.sh
RUN yarn build
