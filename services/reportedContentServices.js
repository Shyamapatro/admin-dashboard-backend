const _ = require("underscore");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

/**
 * ######### @function addReportedContent ########
 * ######### @params => objToSave     ########
 * ######### @logic => Add ReportedContent ########
 */
 exports.addReportedContent= async (objToSave) => {
	return await baseService.saveData(Models.reportContent, objToSave);
};

/**
 * ######### @function updateReportedContent ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update ReportedContent ########
 */
 exports.updateReportedContent = async (criteria, objToSave) => {
	return await baseService.updateData(Models.reportContent, criteria, objToSave);
};

/**
 * #########    @function deleteReportedContent            ########
 * #########    @params => criteria                     ########
 * #########    @logic => Used to Delete ReportedContent     #######
 */
exports.deleteReportedContent = async (criteria) => {
	return await baseService.delete(Models.reportContent, criteria);
};

/**
 * ######### @function getReportedContent ########
 * ######### @params => objToSave     ########
 * ######### @logic => get ReportedContent ########
 */
 exports.getReportedContent= async (objToSave) => {
	return await baseService.getSingleRecord(Models.reportContent, objToSave);
};

exports.getAllReportedContent = (criteria, projection, limit, offset) => {
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
	if (criteria["isDeleted"] === 1) where.isBlocked = 0;
	if (criteria["status"] === 'pending') where.status = 'pending';
	if (criteria["status"] === 'approved') where.status = 'approved';
	if (criteria["status"] === 'declined') where.status = 'declined';

return new Promise((resolve, reject) => {
		Models.reportContent
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