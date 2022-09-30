"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const baseService = require("./base");

/**
 * ######### @function addNotification ########
 * ######### @params => objToSave     ########
 * ######### @logic => Add Notification ########
 */
 exports.addNotification= async (objToSave) => {
	return await baseService.saveData(Models.notification, objToSave);
};

/**
 * ######### @function updateNotification ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update Notification ########
 */
 exports.updateNotification = async (criteria, objToSave) => {
	return await baseService.updateData(Models.notification, criteria, objToSave);
};
/**
 * #########    @function deleteNotification            ########
 * #########    @params => criteria                     ########
 * #########    @logic => Used to Delete Notification     #######
 */
exports.deleteNotification = async (criteria) => {
	return await baseService.delete(Models.notification, criteria);
};

/**
 * ######### @function getNotification ########
 * ######### @params => objToSave     ########
 * ######### @logic => get Notification ########
 */
 exports.getNotification= async (objToSave) => {
	return await baseService.getSingleRecord(Models.notification, objToSave);
};

exports.getAllNotification = (criteria, projection, limit, offset) => {
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
				Title: {
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
	if (criteria["isDeleted"] === 1) where.isBlocked = 0;
	
	
	return new Promise((resolve, reject) => {
		Models.notification
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

