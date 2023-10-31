FROM node:20-alpine as dependencies
WORKDIR /opt/mrg
EXPOSE 4444 4488
COPY ./ ./
RUN npm install --force
RUN npm run build
CMD ["npm", "start"]