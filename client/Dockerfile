FROM node:20-alpine as dependencies
WORKDIR /opt/mrg

COPY *.json ./
EXPOSE *
COPY ./ ./

RUN npm install

ENV NEXT_PUBLIC_PRODUCTION_MODE=true
ENV NEXT_PUBLIC_SELF *
ENV NEXT_PUBLIC_SERVER *
ENV NEXT_PUBLIC_WS_SERVER=*
ENV NEXT_PUBLIC_GA_ID=*
ENV NEXT_PUBLIC_YM=*

RUN npm run build
CMD ["npm", "start"]