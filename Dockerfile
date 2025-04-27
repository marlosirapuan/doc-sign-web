FROM node:20

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN pnpm install

COPY . .

EXPOSE 5176

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
