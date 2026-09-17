FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npx playwright install --with-deps chromium

CMD ["npm", "run", "test:ci"]
