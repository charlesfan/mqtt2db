const schema = require('./mssql-schema');
const _mssql = require('./mssql')
const _ = require('lodash');

function RowData() {
	const self = this
	self.tables = {
		OneDayEfficiency: schema.OneDayEfficiency,
		FullTable: schema.FullTable
	};
	self.repository = new _mssql.Server();
}

RowData.prototype.Save = function(object) {
	const self = this;
	let params = [];
	let keys = _.keys(object);

	keys.forEach(function(key) {
		let tmp = {};
		tmp.param = key;
		tmp.value = object[key];

		switch(key) {
			case 'dev_id':
				tmp.type = self.tables.OneDayEfficiency.Station_GUID;
				break;
			case 'card_id':
				tmp.type = self.tables.FullTable.RFID_ID;
				break;
			case 'checkin_time':
				tmp.type = self.tables.FullTable.Checkin_time;
				break;
			case 'checkout_time':
				tmp.type = self.tables.FullTable.Checkout_time;
				break;
			case 'working_time':
				tmp.type = self.tables.FullTable.Interval_sec;
				break;
		}
		params.push(tmp);
	});

	self.repository.storedProcedure('InsertRowData', params, function(err) {
		if(err) {
			console.error('mssql Stored Procedure Error ====>')
			//console.error(err)
		}
	});
}
exports.RowData = RowData;
