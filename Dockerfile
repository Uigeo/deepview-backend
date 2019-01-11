FROM node:latest


# 앱 소스 추가
COPY . .
RUN npm install

EXPOSE 3001

WORKDIR /

CMD [ "yarn", "start" ]