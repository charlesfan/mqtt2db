const PROTOCOL = 'mqtt://'

const argv = require('minimist')(process.argv.slice(2));
const mqtt = require('./lib/mqtt');
const _ = require('lodash');
const broker = require('./lib/config').broker;
const handler = require('./lib/handler')

delete argv._;

const tags = _.keys(argv);

function main() {
	let id = process.env.BROKER_SUB_ID || 'tmp';
	let topic = process.env.MQTT_TOPIC || 'data';
	let host = broker.host;
	let port = broker.port;

	tags.forEach(function(key) {
		switch(key) {
			case 'i':
				id = argv[key];
				break;
			case 't':
				topic = argv[key];
				break;
			case 'h':
				host = argv[key];
				break;
			case 'p':
				port = argv[key];
				break;
			}
	});

	let topics = [topic, 'LOSN/TI/DEVICE_INFO'];

	let client = new mqtt.Client(PROTOCOL + host, port, id);
	client.subscribe(topics);
	client.message();
}
main();
