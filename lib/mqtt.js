const mqtt = require('mqtt');
const mssql = require('./mssql');
const storeProcedure = require('./storeProcedure');
const respotority = require('./respotority');

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

		switch(topic) {
			case 'LOSN/TI/OFF':
				insertRowData(JSON.parse(message));
				break;
			case 'LOSN/TI/DEVICE_INFO':
				updateDeviceInfo(JSON.parse(message));
				break;
		}
	});
}

function insertRowData(data) {
	try {
		let handler = new storeProcedure.RowData();
		handler.Save(data);
	} catch(err) {
		console.error(err);
	}
}

function updateDeviceInfo(info) {
	try {
		if(!info.hasOwnProperty('dev_id')) {
			return console.error('Miss info: dev_id');
		}

		let id = info.dev_id;
		delete info.dev_id;

		let db = new mssql.Server();
		let deviceInfo = new respotority.deviceInfo(db);
		let whereOpts = {
			UUID: {
				value: id
			}
		}

		deviceInfo
			.Update(info)
			.where(whereOpts)
			.query();

	} catch(err) {
		console.error(err);
	}
}

exports.Client = Client;
