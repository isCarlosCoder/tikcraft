# Use uma imagem oficial do Node.js baseada no Debian
FROM node:18-slim

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Instala as dependências
RUN npm install --only=production

# Copia o restante do código fonte
COPY . .

# Expõe a porta que o servidor usa
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
