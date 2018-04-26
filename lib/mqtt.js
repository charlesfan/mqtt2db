const mqtt = require('mqtt');

function Client(host, port, id) {
	let self = this;
	self.conn = mqtt.connect(host, {port: port, clientId: id});
}

Client.prototype.subscribe = function(topic) {
	let self = this;

	self.conn.on('connect', function(re, err){
			if (err) {
				console.log(err)
			}
			self.conn.subscribe(topic, {qos:1});
	});

	self.conn.on('message', function(topic, msg){
			console.log('Received Message:', topic, new Buffer(msg).toString('utf8'));
	});
}
exports.Client = Client;
