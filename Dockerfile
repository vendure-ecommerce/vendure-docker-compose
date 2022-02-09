FROM node:14.18.3-bullseye-slim

WORKDIR /usr/src/app

COPY package.json ./

RUN apt-get update
RUN apt-get install python build-essential -y
#COPY yarn.lock ./
RUN yarn
COPY . .
RUN chmod +x /usr/src/app/wait-for-it.sh
#RUN yarn build
