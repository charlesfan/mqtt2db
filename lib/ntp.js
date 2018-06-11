const http = require('http');
const util = require('util');
const querystring = require('querystring');
const config = require('./config').ntp;

module.exports = ntp = async function(ip) {
	let time = new Date(Date.now() + config.timeOffset);
	let data = util.format(config.body,
			time.getUTCFullYear(),
			time.getUTCMonth() + 1,
			time.getUTCDate(),
			time.getUTCHours(),
			time.getUTCMinutes(),
			time.getUTCSeconds()
			);

	let postData = querystring.stringify({
		'__SL_P_S.J': data
	});

	headers = config.headers;
	headers['Content-Length'] = Buffer.byteLength(postData);

	let opts = {
		host: ip,
		path: config.path,
		method: config.method,
		headers: headers,
		timeout: 5000
	}

	let req = http.request(opts, (res) => {
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log('Response: ' + chunk);
		});
		res.on('end', () => {
			console.log('No more data in response.');
		});
	});

	req.on('error', (err) => {
		console.error(`problem with request: ${err.message}`);
	});
	req.write(postData);
	req.end();
}

