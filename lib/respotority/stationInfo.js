/**
 *	For old DB Schema.
 * */

const mssql = require('mssql');
const _ = require('lodash');

const VARCHAR = mssql.VarChar;
const INT = mssql.Int;
const DATETIME = mssql.DateTime2;
const FLOAT = mssql.Float;
const Schema = {
	GUID: VARCHAR,
	Station: INT,
	Namee: VARCHAR,
	IP_Address: VARCHAR
}

const StationInfo = function(db) {
	this.db = db;
	this.schema = Schema;
	this.cmd = '';
}

//Private
StationInfo.prototype._whereCmd = function(opts, key, index, tag) {
	let self = this;

	if(Array.isArray(opts[key].value)) {
		self.cmd += key + ' in ('
		opts[key].value.forEach(function(value, i) {
			let iName = 'in'+ tag + i;
			self.db.request.input(iName, Schema[key], value);
			self.cmd += '@' + iName;
			if(i < opts[key].value.length-1) {
				self.cmd += ', '
			}
		});
		self.cmd += ') ';
		return;
	}

	let _tag = 'where' + tag + index;
	self.db.request.input(_tag, Schema[key], opts[key].value);

	console.log(opts[key]);
	switch(opts[key].type) {
		case 'downner':
			self.cmd += key + ' <= @' + _tag + ' ';
			break;
		case 'upper':
			self.cmd += key + ' > @' + _tag + ' ';
			break;
		default:
			self.cmd += key + ' = @' + _tag + ' ';
			break;
	}
}

StationInfo.prototype._setCmd = function(key, value, index, tag) {
	let self = this;
	let _tag = 'set' + tag + index;

	self.db.request.input(_tag, Schema[key], value);
	self.cmd += key + ' = @' + _tag;
}

//Public
StationInfo.prototype.Select = function(params) {
	this.cmd = (params && Object.keys(params).length > 0) ?
    'select ' + paramsBinding(params) + 'from ' + table + ' ':
    'select * from StationInfo ';
	return this;
}

StationInfo.prototype.Update = function(params) {
	let self = this;
	self.cmd = 'update Station_Info set '
	let keys = _.keys(params);

	keys.forEach(function(key, i) {
		let tag = 0;
		self._setCmd(key, params[key], i, tag);
		self.cmd += (keys[i+1]) ? ' AND ' : ' ';
		tag++;
	});
	return self;
}

StationInfo.prototype.where = function(opts) {
	let self = this;
	if(Object.keys(opts).length > 0) {
		this.cmd += (this.cmd.indexOf('where') > 0) ? 
			'and ':
			'where ';

		let keys = _.keys(opts);

		keys.forEach(function(key, index) {
			if(!Schema.hasOwnProperty(key)) {
				return console.log(key + ': StationInfo has no this column.');
			}
			let tag = 0;
			self._whereCmd(opts, key, index, tag);
			if(index < keys.length - 1) {
				self.cmd += 'and ';
				tag++;
			}
		});
	}
	return this;
}

StationInfo.prototype.order = function(key, desc) {
	this.cmd += (desc && typeof(desc) === 'boolean') 
		? 'order by ' + key + ' DESC '
		: 'order by ' + key + ' ';
	return this;
}

StationInfo.prototype.top = function(n) {
	this.cmd = this.cmd.slice(0, 7) + 'top ' +
  n + ' ' +
  this.cmd.slice(7) + ' ';
  return this;
}

StationInfo.prototype.offset = function(offset, next) {
	this.cmd += 'offset ' + offset + ' rows ';
	if(next) {
		this.cmd += 'fetch next ' + next + ' rows only ';
	}
	return this;
}

StationInfo.prototype.getSQL = function() {
	return this.cmd;
}

StationInfo.prototype.query = async function() {
	let result;
	console.log(this.cmd);
	try {
	await this.db.query(this.cmd).then(datas => {
		result = datas.recordset;
	});
	} catch(err) {
		console.log(err);
	}
	return result;
}
exports.StationInfo = StationInfo;
