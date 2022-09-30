"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const baseService = require("./base");

/**
 * ######### @function addCategory ########
 * ######### @params => objToSave     ########
 * ######### @logic => Add Category ########
 */
 exports.addCategory= async (objToSave) => {
	return await baseService.saveData(Models.category, objToSave);
};

/**
 * ######### @function updateCategory ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update Category ########
 */
 exports.updateCategory = async (criteria, objToSave) => {
  console.log('updateCategory', criteria, objToSave);
	return await baseService.updateData(Models.category, criteria, objToSave);
};
/**
 * #########    @function deleteCategory            ########
 * #########    @params => criteria                     ########
 * #########    @logic => Used to Delete Category     #######
 */
exports.deleteCategory = async (criteria) => {
	return await baseService.delete(Models.category, criteria);
};

/**
 * ######### @function getCategory ########
 * ######### @params => objToSave     ########
 * ######### @logic => get Category ########
 */
 exports.getCategory= async (objToSave) => {
	return await baseService.getSingleRecord(Models.category, objToSave);
};

/**
 * ######### @function getCategory ########
 * ######### @params => objToSave     ########
 * ######### @logic => get Category ########
 */
 exports.getAllCategory= async (projection) => {
	return new Promise((resolve, reject) => {
		Models.category.findAndCountAll({
				attributes: projection,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});};

exports.getFilterDetails = (criteria, projection, limit, offset) => {
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
	
	// where.isDeleted = 0;
	// if (criteria["isBlocked"] === 1) where.isBlocked = 1;
	// if (criteria["isDeleted"] === 1) where.isBlocked = 0;
	
	
	return new Promise((resolve, reject) => {
		Models.category
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

