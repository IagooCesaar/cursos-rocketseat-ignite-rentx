FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3333
EXPOSE 9229

CMD [ "npm","run","dev" ]