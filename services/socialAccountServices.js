"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const baseService = require("./base");

/**
 * ######### @function addSocialAccounts ########
 * ######### @params => objToSave     ########
 * ######### @logic => Add addSocialAccounts ########
 */
 exports.addSocialAccounts= async (objToSave) => {
	return await baseService.saveData(Models.socialAccounts, objToSave);
};



exports.getAllSocialDetails = (criteria, projection, limit, offset) => {
	let where = {};
	let order = [
		[
			criteria.sortBy ? criteria.sortBy : "createdAt",
			criteria.orderBy ? criteria.orderBy : "DESC"
		]
	];
	if (criteria && criteria.search) {
		where = {
			[Op.or]: {
				title: {
					[Op.like]: "%" + criteria.search + "%"
				},
				message: {
					[Op.like]: "%" + criteria.search + "%"
				},
				image: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	
	where.isDeleted = 0;
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	if (criteria["isBlocked"] === 0) where.isBlocked = 0;
	if (criteria["loginType"] === 1) where.loginType = 1;
	if (criteria["loginType"] === 2) where.loginType = 2;
	if (criteria["loginType"] === 3) where.loginType = 3;
	if (criteria["loginType"] === 4) where.loginType = 4;
	if (criteria["loginType"] === 5) where.loginType = 5;
	if (criteria["platformType"] === "ANDROID") where.platformType = "ANDROID";
	if (criteria["platformType"] === "IOS") where.platformType = "IOS";
	if (criteria["platformType"] === "WEB") where.loginType = "WEB";
	
	return new Promise((resolve, reject) => {
		Models.socialAccounts
			.findAndCountAll({
				limit,
				offset,
				where: where,
				attributes: projection,
				order: order,
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("getAll err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

