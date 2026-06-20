const statusCodes = {};

statusCodes[exports.PROCESSING = 102] = "Processing";
statusCodes[exports.OK = 200] = "OK";
statusCodes[exports.CREATED = 201] = "Created";
statusCodes[exports.NO_CONTENT = 204] = "No Content";
statusCodes[exports.USE_PROXY = 305] = "Use Proxy";
statusCodes[exports.BAD_REQUEST = 400] = "Bad Request";
statusCodes[exports.UNAUTHORIZED = 401] = "Unauthorized";
statusCodes[exports.FORBIDDEN = 403] = "Forbidden";
statusCodes[exports.NOT_FOUND = 404] = "Not Found";
statusCodes[exports.METHOD_NOT_ALLOWED = 405] = "Method Not Allowed";
statusCodes[exports.NOT_ACCEPTABLE = 406] = "Not Acceptable";
statusCodes[exports.REQUEST_TIMEOUT = 408] = "Request Timeout";
statusCodes[exports.CONFLICT = 409] = "Conflict";
statusCodes[exports.LENGTH_REQUIRED = 411] = "Length Required";
statusCodes[exports.PRECONDITION_FAILED = 412] = "Precondition Failed";
statusCodes[exports.PRECONDITION_FAILED = 422] = "Unprocessable Entity";
statusCodes[exports.TOO_MANY_REQUESTS = 429] = "Too Many Requests";
statusCodes[exports.INTERNAL_SERVER_ERROR = 500] = "Server Error";
statusCodes[exports.BAD_GATEWAY = 502] = "Bad Gateway";
statusCodes[exports.SERVICE_UNAVAILABLE = 503] = "Service Unavailable";
statusCodes[exports.GATEWAY_TIMEOUT = 504] = "Gateway Timeout";
statusCodes[exports.INSUFFICIENT_STORAGE = 507] = "Insufficient Storage";
statusCodes[exports.NETWORK_AUTHENTICATION_REQUIRED = 511] = "Network Authentication Required";

const setResponse = (status, statusCode, resMessage, addresMessage, resData = []) => {
		let obj = {};
		let error = {
			"code": "",
			"message": "",
			"additional_info": ""
		};
		let handlerMessage = statusCodes[statusCode];
		
		obj["error"] = error;
		if (status == false) {
			error['code'] = statusCode;
			if (resMessage == '') {
				error['message'] = handlerMessage;
			} else {
				error['message'] = resMessage;
			}
			error['additional_info'] = addresMessage;
		}
		
		obj['status'] = status;
		if (resMessage == '') {
			obj['message'] = handlerMessage;
		} else {
			obj['message'] = resMessage;
		}
		

		obj['data'] = resData;

		return obj;
	}

module.exports = {
	setResponse
};