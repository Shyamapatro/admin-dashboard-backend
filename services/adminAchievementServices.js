"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const baseService = require("./base");

Models.adminAchievement.hasMany(Models.adminAchivementLevel, { foreignKey: "id" });
Models.adminAchivementLevel.belongsTo(Models.adminAchievement, { foreignKey: "id" });
/**
 * ######### @function addAchievement ########
 * ######### @params => objToSave     ########
 * ######### @logic => Add Achievement ########
 */
 exports.addAchievement= async (objToSave) => {
	return await baseService.saveData(Models.adminAchievement, objToSave);
};

/**
 * ######### @function updateAchievement ########
 * ######### @params => criteria, objToSave ########
 * ######### @logic => Used to update Achievement ########
 */
 exports.updateAchievement = async (criteria, objToSave) => {
    console.log('updateAchievement----', criteria, objToSave);
	return await baseService.updateData(Models.adminAchievement, criteria, objToSave);
};
/**
 * #########    @function deleteAchievement            ########
 * #########    @params => criteria                     ########
 * #########    @logic => Used to Delete Achievement     #######
 */
exports.deleteAchievement = async (criteria) => {
	return await baseService.delete(Models.adminAchievement, criteria);
};

/**
 * ######### @function getAchievement ########
 * ######### @params => objToSave     ########
 * ######### @logic => get Achievement ########
 */
 exports.getAchievement= async (objToSave) => {
    console.log(objToSave)
	return await baseService.getSingleRecord(Models.adminAchievement, objToSave);
};

exports.getAllAdminsAchievement = (criteria, projection, limit, offset) => {
	let where = {};
  let order = [
    [
      criteria.sortBy ? criteria.sortBy : "createdAt"||"name"||"Type",
      criteria.orderBy ? criteria.orderBy : "ASC"||"DESC",
    ],
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

 exports.getAllAdminsAchievement = (criteria, limit, offset) => {
    let where = {};
    let order = [
      [
        criteria.sortBy ? criteria.sortBy : "createdAt"||"name"||"Type",
        criteria.orderBy ? criteria.orderBy : "ASC"||"DESC",
      ],
    ];
    if (criteria && criteria.search) {
      where = {
        [Op.or]: {
          name: {
            [Op.like]: "%" + criteria.search + "%",
          },
          Type: {
            [Op.like]: "%" + criteria.search + "%",
          },
        }
      };
    }
    if (criteria && criteria.Type) {
      where.Type = criteria.Type;
    }
    if (criteria && criteria.name) {
        where.name = criteria.name;
      }
    // where.destroyTime = null;
   
    // if(criteria&&criteria.search){
    //    attributes=["id","name","AchievementId"]
    // }
    // else{
    //    attributes={exclude:["name","id","AchievementId","createdAt","updatedAt"]}
    // }
    return new Promise((resolve, reject) => {
      Models.adminAchievement.findAndCountAll({
        limit,
        offset,
       
       
        where: where,
        order: order,
      })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.log("getAll err ==>>  ", error);
        });
    });
  };
 