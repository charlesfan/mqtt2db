const mqtt = require('mqtt');
const mssql = require('./mssql');
const storeProcedure = require('./storeProcedure');
const respotority = require('./respotority/stationInfo');

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

Client.prototype.devMessage = function() {
	this.conn.on('message', function(topic, msg){
		let message = new Buffer(msg).toString('utf8');
		console.log('Received Message:', topic, message);

		try {
			let info = JSON.parse(message);
			if(!info.hasOwnProperty('dev_id')) {
				return console.error('Miss info: dev_id');
			}
			let id = info.dev_id;
			delete info.dev_id;

			let db = new mssql.Server();
			let stationInfo = new respotority.StationInfo(db);
			let whereOpts = {
				GUID: {
					value: id
				}
			}

			stationInfo
				.Update(info)
				.where(whereOpts)
				.query();

		} catch(err) {
			console.error(err);
		}
	});
}
exports.Client = Client;
