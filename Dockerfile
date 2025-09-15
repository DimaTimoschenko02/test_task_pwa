FROM node:20-alpine

WORKDIR /app

ENV HUSKY=0

# Сначала зависимости
COPY package*.json ./
RUN npm install

# Затем исходники и конфиги
COPY . .

# Сборка TypeScript
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Запускаем сид и затем приложение
CMD ["sh", "-lc", "npm run seed && node dist/main.js"]
