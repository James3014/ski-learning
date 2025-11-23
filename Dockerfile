FROM node:18-alpine
LABEL "language"="nodejs"
LABEL "framework"="nest.js"
WORKDIR /src
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start:prod"]
