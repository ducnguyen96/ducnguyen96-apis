FROM node:lts-alpine3.13 AS dist
COPY package.json ./

RUN yarn install

COPY . ./

RUN yarn build

FROM node:lts-alpine3.13 AS node_modules
COPY package.json ./

RUN yarn install --prod

FROM node:lts-alpine3.13

ARG PORT=3001

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules

COPY package.json /usr/src/app

EXPOSE $PORT

CMD [ "yarn", "start:prod" ]
