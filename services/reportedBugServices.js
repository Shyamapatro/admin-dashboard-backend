const _ = require("underscore");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");


/**
 * ######### @function addReportBug ########
 * ######### @params => objToSave     ########
 * ######### @logic => Add ReportBug ########
 */
 exports.addReportBug= async (objToSave) => {
	return await baseService.saveData(Models.reportedBug, objToSave);
};

/**
 * ######### @function updateReportBug ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update ReportBug ########
 */
 exports.updateReportBug = async (criteria, objToSave) => {
	return await baseService.updateData(Models.reportedBug, criteria, objToSave);
};
/**
 * #########    @function deleteReportBug            ########
 * #########    @params => criteria                     ########
 * #########    @logic => Used to Delete ReportBug     #######
 */
exports.deleteReportBug = async (criteria) => {
	return await baseService.delete(Models.reportedBug, criteria);
};

/**
 * ######### @function getReportBug ########
 * ######### @params => objToSave     ########
 * ######### @logic => get ReportBug ########
 */
 exports.getReportBug= async (objToSave) => {
	return await baseService.getSingleRecord(Models.reportedBug, objToSave);
};



exports.getAllReportBug = (criteria, projection, limit, offset) => {
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
		Models.reportedBug
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