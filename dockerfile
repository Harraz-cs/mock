FROM node:18.16.1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g @sap/cds-dk
EXPOSE 4004
CMD [ "npm", "start"]
