"use strict";
var Service = require("../services");
const Response = require("../config/response");
const messages = require("../config/messages");
var Jwt = require("jsonwebtoken");
var setTokenInDB = async (id, tokenData) => {
	var dataToSave = {
		userId: id,
        accessToken: tokenData
	};
	let condition = {
		userId: id
	};
	
	await Service.userServiceSessions.deleteSessions(condition);
	let createSession = await Service.userServiceSessions.saveSessionData(dataToSave);
	if (!createSession) throw Response.error_msg.implementationError;
};
var expireTokenInDB = async (userId) => {
	let condition = {
		userId: id
		
	};
	let removeSession = await Service.userServiceSessions.deleteSessions(condition);
	if (!removeSession) throw Response.error_msg.implementationError;
	else return removeSession;
};
var setToken = (tokenData, PRIVATE_KEY, callback) => {

	if (!tokenData.id) {
		callback(Response.error_msg.implementationError);
	} else {
		var tokenToSend = Jwt.sign(tokenData, PRIVATE_KEY);
		setTokenInDB(tokenData.id, tokenToSend);
		callback(null, { accessToken: tokenToSend });
	}
};
var expireToken = (token, callback) => {
	expireTokenInDB(token.id);
	callback(null, messages.success.LOGOUT);
};
module.exports = {
	expireToken: expireToken,
	setToken: setToken,
};