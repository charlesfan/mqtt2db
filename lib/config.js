var config = exports;

//MQTT Broker
config.broker = {
  host: process.env.BROKER_HOST || 'localhost',
  port: 1883
}

config.mssqlServer = {
  server: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 1433,
  database: process.env.DataBase || 'losn-ti'
}

config.ntp = {
	port: 80,
	path: '/api/1/wlan/set_time',
	method : 'POST',
	headers: { 
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: '%s,%s,%s,%s,%s,%s',
	timeOffset: 8*60*60*1000
}
