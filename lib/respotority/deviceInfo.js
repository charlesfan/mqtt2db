const mssql = require('mssql');
const _ = require('lodash');
const sql = require('./sql');

const VARCHAR = mssql.VarChar;
const INT = mssql.Int;
const BigINT = mssql.BigInt;
const DATETIME = mssql.DateTime2;
const FLOAT = mssql.Float;
const Schema = {
	UUID: VARCHAR,
	Station_UUID: VARCHAR,
	IP_Address: VARCHAR,
	FW_Version: VARCHAR,
	Rebooted: BigINT
}

module.exports = deviceInfo = function(db) {
	sql.call(this, db, 'Device_Info', Schema);
}

deviceInfo.prototype = Object.create(sql.prototype);
deviceInfo.prototype.constructor = deviceInfo;
