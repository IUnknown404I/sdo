FROM node:20-alpine as dependencies
WORKDIR /opt/mrg
EXPOSE * *
COPY ./ ./
RUN npm install
RUN npm run build
CMD ["npm", "start"]