FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (TODAS, no solo producción)
RUN npm install

# Copiar todo el código
COPY . .

# Exponer puerto
EXPOSE 4000

# Comando de inicio (usa el mismo comando que funciona localmente)
CMD ["npm", "start"]