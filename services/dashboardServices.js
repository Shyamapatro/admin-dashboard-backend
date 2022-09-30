"use strict";
const _ = require("underscore");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");



Models.users.hasOne(Models.socialAccounts, {
	foreignKey: "userId",
	as: "userSocial"
});

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.socialAccounts, objToSave);
};

// exports.updateData = async (criteria, objToSave,) => {
// 	return await baseService.updateData(Models.UserSocialAccount, criteria, objToSave);
// };
// exports.delete = async (criteria) => {
// 	return await baseService.delete(Models.UserSocialAccount, criteria);
// };

// exports.count = async (criteria) => {
// 	let where = {};
	
// 	if (criteria && (criteria.isBlocked !== undefined)) {
// 		where.isBlocked = criteria.isBlocked;
// 	}
// 	return await baseService.count(Models.UserSocialAccount, where);
// };
exports.getUsersSocial = async(criteria, projection) => {
	return await baseService.getSingleRecord(Models.socialAccounts, criteria, projection);

};


