# ==========================
# 1️⃣ BUILD aşaması
# ==========================
FROM node:20-alpine AS builder
WORKDIR /app

# Bağımlılıkları ekle
COPY package*.json ./
RUN npm install

# Kodları kopyala
COPY . .

# Production build al
RUN npm run build

# ==========================
# 2️⃣ RUN aşaması (lightweight)
# ==========================
FROM node:20-alpine AS runner
WORKDIR /app

# Build çıktısını kopyala
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production
ENV PORT=3000

# Sadece gerekli modüller
RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
