FROM node:22-alpine

WORKDIR /app

# cache eficiente
COPY package*.json ./
RUN npm ci

# código
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
