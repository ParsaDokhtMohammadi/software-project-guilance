FROM node:24

WORKDIR /src/app

COPY package.json package-lock.json ./
RUN npm i

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
