# mqtt2db

Start a subscriber:
```
node app.js -i <clientId> -t <topic> -h <host of broker> -p <port of broker>
```

#### Create docker image
```
$ cd <PROJECT_PATH>/image
$ docker build -t="liteon/mqtt2db:0.0.1" .
```
#### Run in docker
```
$ docker run --name mqtt-test -e DB_HOST=<address> -e DB_PASSWORD=<password> -e DB_USER=<user> -e BROKER_HOST=<ip> -e BROKER_SUB_ID=<id> -e MQTT_TOPIC=<topic> -d liteon/mqtt2db:0.0.1
```

#### Create image with env
```
$ cd <PROJECT_PATH>/image
$ docker build -t="liteon/mqtt2db:0.01" --build-arg DB_HOST=<ip> --build-arg DB_PASSWORD=<password> --build-arg DB_USER=<user> --build-arg BROKER_HOST=<ip> .
```
