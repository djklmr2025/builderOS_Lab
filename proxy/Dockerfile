# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos
COPY . .

# Instala dependencias
RUN npm install

# Expone el puerto 3000
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]
