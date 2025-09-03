FROM node:22-alpine AS builder

WORKDIR /app
COPY ./package*.json /app/
COPY ./prisma /app/

RUN npm install

COPY . .
RUN npx prisma generate


FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
