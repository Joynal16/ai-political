FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends chromium fonts-noto-core fonts-noto-extra && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
EXPOSE 5000
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
CMD ["npm","start"]
