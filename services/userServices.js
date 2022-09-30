"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const appConstants = require("./../config/appConstants");
const baseService = require("./base");

Models.socialAccounts.belongsTo(Models.users, {
	foreignKey: "id",
	as: "user"
});
Models.users.hasOne(Models.socialAccounts, {
	foreignKey: "id",
	as: "userSocialAccounts"
});

Models.users.hasOne(Models.session, {
	foreignKey: "id",
	as: "userSession"
});
/**
 * ######### @function getAdmin ########
 * ######### @params => criteria, projection  ########
 * ######### @logic => Used to retrieve specific admin ########
 */
exports.getUser = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models.users.findOne({
				where: criteria,
				attributes: projection
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
/**
 * ######### @function addUser ########
 * ######### @params => criteria, objToSave  ########
 * ######### @logic => Used to add admin ########
 */
 exports.addUser= async (objToSave) => {
	return await baseService.saveData(Models.users, objToSave);
};
/**
 * ######### @function updateAdmins ########
 * ######### @params => criteria, objToSave  ########
 * ######### @logic => Used to update admin ########
 */
exports.updateUsers = async(criteria, objToSave) => {

	return await baseService.updateData(Models.users, criteria, objToSave);

};

/**
 * ######### @function getAllAdmins ########
 * ######### @params => criteria, projection,limit, offset     ########
 * ######### @logic => Used to retrieve all the matching admin users ########
 */
exports.getAllUsers = (criteria, projection, limit, offset) => {
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
				firstName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				lastName: {
					[Op.like]: "%" + criteria.search + "%"
				},
				email: {
					[Op.like]: "%" + criteria.search + "%"
				},
			}
		};
	}
	
	where.isDeleted = 0;
	if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	
	
	return new Promise((resolve, reject) => {
		Models.users
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

exports.deleteUserDetails = async (criteria) => {
	return await baseService.delete(Models.users, criteria);
};