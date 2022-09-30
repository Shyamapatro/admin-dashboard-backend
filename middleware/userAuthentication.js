const Jwt = require("jsonwebtoken");
const Services = require("../services");
const env = require("../config/env")();
const response = require("../config/response");
const verifyToken = (req, res, next) => {
	try {
		if (req.headers && req.headers.authorization) {
			var token = req.headers.authorization;
			token = token.replace("Bearer ", "");
			Jwt.verify(token, env.APP_URLS.PRIVATE_KEY, async (err, tokenData) => {
				console.log("tokenData   ", tokenData);
				if (err) {
					return res.status(401).send(response.error_msg.invalidToken);
				} else {
					let criteria = {
						id: tokenData.id,
						isDeleted: 0,
					};
					let projection = ["id", "email", "isBlocked"];
					let userData = await Services.userServices.getUser(criteria, projection);
					if (userData) {
						if (userData && userData.isBlocked == "1") {
							return res.status(401).json({
								statusCode: 401,
								message: "Your account has been blocked by the Admin. Please contact support@support.com.",
							});
						} else {
							//condition to store into userActivity
						
							/*	if (userData) {
								await Services.UserActivityService.saveData({
									userId: userData.id,
									url: "goingOn"
								});
							}
						*/	
							req.credentials = tokenData;
							req.credentials.accessToken = req.headers.authorization;
							next();
						}
					} else {
						return res.status(401).json({
							statusCode: 401,
							message: "The token is not valid or User not Found!",
						});
					}
				}
			});
		} else {
			return res.status(401).send(response.error_msg.invalidToken);
		}
	} catch (err) {
		return res.status(401).send(response.error_msg.invalidToken);
	}
};
module.exports = {
	verifyToken: verifyToken
};