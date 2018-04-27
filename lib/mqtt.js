const mqtt = require('mqtt');
const storeProcedure = require('./storeProcedure');

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
}

Client.prototype.message = function() {
	this.conn.on('message', function(topic, msg){
		let message = new Buffer(msg).toString('utf8');
		console.log('Received Message:', topic, message);

		try {
			let handler = new storeProcedure.RowData();
			handler.Save(JSON.parse(message));
		} catch(err) {
			console.error(err);
		}
	});
}

exports.Client = Client;
