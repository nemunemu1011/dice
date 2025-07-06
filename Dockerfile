FROM node:16.x
WORKDIR /app
COPY app/ .
RUN npm install
EXPOSE 3000
CMD ["node", "main.mjs"]
