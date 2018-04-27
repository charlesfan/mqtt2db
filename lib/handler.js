const mssql = require('./mssql');
const storeProcedure = require('./storeProcedure');

function RowData() {
	this.storeProcedure = storeProcedure.newMssql();
}

RowData.prototype.save = function() {
	return this.storeProcedure.InsertRowData
}
