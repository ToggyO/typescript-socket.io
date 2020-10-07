FROM node:14.11.0
ENV NODE_ENV production
WORKDIR  /usr/app
COPY ./package*.json ./
RUN npm install --silent --production
COPY ./ ./
RUN npm run build
CMD npm run migrate:up && npm start
