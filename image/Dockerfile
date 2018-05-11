# Losen-mqtt2db image
FROM node:latest
MAINTAINER Charles <charles.fan@liteon.com>
RUN apt-get -qq update
RUN apt-get -qqy install git
RUN git clone https://github.com/charlesfan/mqtt2db.git
RUN cd mqtt2db && npm install
# Set ENV from ARG
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG BROKER_HOST
ARG BROKER_SUB_ID
ARG MQTT_TOPIC
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV BROKER_HOST=${BROKER_HOST}
ENV BROKER_SUB_ID=${BROKER_SUB_ID}
ENV MQTT_TOPIC=${MQTT_TOPIC}
# Run
CMD ["node", "/mqtt2db/app.js"]
