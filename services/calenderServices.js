const _ = require("underscore");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

/**
 * ######### @function addCalender ########
 * ######### @params => objToSave     ########
 * ######### @logic =>  addCalender ########
 */
 exports.addCalender= async (objToSave) => {
	return await baseService.saveData(Models.calender, objToSave);
};

/**
 * ######### @function updateCalender ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update updateCalender ########
 */
 exports.updateCalender = async (criteria, objToSave) => {
	return await baseService.updateData(Models.calender, criteria, objToSave);
};

/**
 * #########    @function deleteCalenderDetails            ########
 * #########    @params => criteria                     ########
 * #########    @logic => Used to Delete ReportedContent     #######
 */
exports.deleteCalenderDetails = async (criteria) => {
	return await baseService.delete(Models.calender, criteria);
};

/**
 * ######### @function getReportedContent ########
 * ######### @params => objToSave     ########
 * ######### @logic => get ReportedContent ########
 */
 exports.getCalendertDetail= async (objToSave) => {
	return await baseService.getSingleRecord(Models.reportContent, objToSave);
};

exports.getAllCalender = (criteria, projection, limit, offset) => {

return new Promise((resolve, reject) => {
		Models.calender
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