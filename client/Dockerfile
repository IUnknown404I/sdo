FROM node:19-alpine as dependencies
WORKDIR /opt/mrg
COPY *.json ./
EXPOSE 4040
COPY ./ ./
RUN npm install --force
ENV NEXT_PUBLIC_PRODUCTION_MODE=true
ENV NEXT_PUBLIC_SELF https://sdo.rnprog.ru
ENV NEXT_PUBLIC_SERVER https://api.sdo.rnprog.ru
ENV NEXT_PUBLIC_WS_SERVER=ws.sdo.rnprog.ru
ENV NEXT_PUBLIC_GA_ID=*
ENV NEXT_PUBLIC_YM=*
RUN npm run build
CMD ["npm", "start"]