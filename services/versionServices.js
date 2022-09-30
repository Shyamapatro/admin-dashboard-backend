"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const baseService = require("./base");

exports.getAppDetails = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.version.findAndCountAll({
        where: criteria,
        attributes: projection,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
      console.log("getAll err ==>>  ", err)
      reject(Response.error_msg.implementationError)
    });
  });
};

exports.appVersionDetails=(criteria, projection)=>{
  return new Promise ((resolve, reject) => {
    Models.version
    .findAll({
    where: criteria,
    attributes: projection,
  })
  .then((res) => {
    resolve(res);
  })
  .catch((err) =>{
    console.log("getAll err ==>>  ", err)
    reject(Response.error_msg.implementationError)
  });
  });
};

exports.addAppDetails = (objToSave) => {
  return new Promise((resolve, reject) => {
    Models.version
      .create(objToSave)
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("ADD Deatils ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.checkVersion = (criteria) => {
  return new Promise((resolve, reject) => {
    Models.version
      .findOne({
        where: criteria,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("getAll err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.countAppVersion = (criteria) => {
  return new Promise((resolve, reject) => {
   Models.version.findAndCountAll({  where:criteria })
      .then((res) => {
      
        resolve(res);
      })
      .catch((err) =>{
        console.log("Count Error  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.updateIsDeleted = (criteria,objToSave) => {
  return new Promise((resolve, reject) => {
    Models.version.update(objToSave,{
     where :criteria
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("update err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

   exports.getPlatform = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.version
      .findAll({
        where: criteria,
        attributes: projection,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("GetPlatform err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};


/**
 * ######### @function getReportBug ########
 * ######### @params => objToSave     ########
 * ######### @logic => get ReportBug ########
 */
 exports.getAppDetail= async (objToSave) => {
	return await baseService.getSingleRecord(Models.version, objToSave);
};
// exports.getAppDetail = (criteria, projection) => {
//   console.log("getAppDetail", criteria, projection);
//   return new Promise((resolve, reject) => {
//     Models.version
//       .findAll({
//         where: criteria,
//         attributes: projection,
//       })
//       .then((res) => {
//         console.log(res);
//         resolve(res);
//       })
//       .catch((err) =>{
//         console.log("getAll err ==>>  ", err)
//         reject(Response.error_msg.implementationError)
//       });
//   });
// };

exports.deleteAppVersion = (criteria) => {
  return new Promise((resolve, reject) => {
    Models.version.destroy({ where: criteria })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("getAll err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};

exports.editDetails = (criteria, objToUpdate) => {
  return new Promise((resolve, reject) => {
    Models.version.update(objToUpdate, { where: criteria })
      .then((res) => {
        resolve(res);
      })
      .catch((err) =>{
        console.log("getAll err ==>>  ", err)
        reject(Response.error_msg.implementationError)
      });
  });
};