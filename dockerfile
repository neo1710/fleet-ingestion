FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# Run migrations and start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
