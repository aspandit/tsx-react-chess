FROM node:26-alpine

ENV NODE_ENV=dev

WORKDIR /usr/src/app

COPY . .

# Install dependencies
RUN npm ci

EXPOSE 5173

CMD [ "npm", "run", "dev"]
