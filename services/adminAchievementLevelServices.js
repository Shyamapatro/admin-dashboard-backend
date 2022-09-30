"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const baseService = require("./base");

/**
 * ######### @function add ########
 * ######### @params => objToSave     ########
 * ######### @logic => Add  ########
 */
 exports.add= async (objToSave) => {
	return await baseService.saveData(Models.adminAchivementLevel, objToSave);
};

/**
 * ######### @function update ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update  ########
 */
 exports.update = async (criteria, objToSave) => {
    console.log('update----', criteria, objToSave);
	return await baseService.updateData(Models.adminAchivementLevel, criteria, objToSave);
};
/**
 * #########    @function delete            ########
 * #########    @params => criteria                     ########
 * #########    @logic => Used to Delete      #######
 */
exports.delete = async (criteria) => {
	return await baseService.delete(Models.adminAchivementLevel, criteria);
};

/**
 * ######### @function get ########
 * ######### @params => objToSave     ########
 * ######### @logic => get  ########
 */
 exports.get= async (objToSave) => {
    console.log(objToSave)
	return await baseService.getSingleRecord(Models.adminAchivementLevel, objToSave);
};


 