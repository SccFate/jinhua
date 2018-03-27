var HTTP = {

	get: function (host, path, data, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
				var response = xhr.responseText;
				cc.log(response);
				callback(response);
			}
			else
			{
			}
		};
		if (data === null) {
			xhr.open("GET", host + path, true);
		} else {
			xhr.open("GET", host + path + '?' + this.queryString(data), true);
		}
		xhr.send();
	},
	post: function (host, path, data, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", host + path, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-Length",data.length);
		xhr.send(data);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
				var response = xhr.responseText;
				cc.log(response);
				callback(response);
			}
			else
			{
			}
		};
	},
	queryString: function (data) {
		var query = "";
		for (var p in data) {
			query += (p + '=' + data[p] + '&');
		}
		if (query.length > 0) {
			return query.substring(0, query.length - 1);
		} else {
			return "";
		}
	},
};

module.exports = HTTP;
