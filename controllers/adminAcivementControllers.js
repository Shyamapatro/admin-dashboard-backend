const _ = require("underscore");
const Joi = require("joi");
const Response = require("../config/response");
let commonHelper = require("../Helper/common");
const moment = require("moment");
let config = require("../config/env")();
let message = require("../config/messages");
const Services = require("../services");
adminAchievementProjection=["name","id","type","createdAt","updatedAt"]
module.exports = {
  AddAchievement: async (payloadData) => {
    const schema = Joi.object().keys({
      name: Joi.string().optional(),
      Type: Joi.string().optional(),
    });
    console.log(payloadData)
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let objToSave = {};
    if (_.has(payload, "name") && payload.name != "")
      objToSave.name = payload.name;
    if (_.has(payload, "Type") && payload.Type != "")
      objToSave.Type = payload.Type;
    objToSave.CreateAt = moment(new Date(Date.now())).format("YYYY-MM-DD");
    let achievementData = await Services.adminAchievementServices.addAchievement(
      objToSave,
      
    );
    if (achievementData) {
      return message.success.ADDED;
    } else {
      throw Response.error_msg.InvalidData;
    }
  },
  getAllAdminsAchievement: async (payloadData) => {
    const schema = Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      sortBy: Joi.string().optional(),
      orderBy: Joi.string().optional(),
      search: Joi.string().optional().allow(""),
      name: Joi.string(),
      Type: Joi.string(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let admins = await Services.adminAchievementServices.getAllAdminsAchievement(
      payload,
      parseInt(payload.limit, 10) || 10,
      parseInt(payload.skip, 10) || 0
    );
    if (admins) {
      return admins;
    } else {
      return {
        rows: [],
        count: 0,
      };
    }
  },
  editAchievement: async (payloadData) => {
    console.log("payloadData",payloadData);
    const schema = Joi.object().keys({
        name: Joi.string().optional(),
        Type: Joi.string().optional(),
        id: Joi.string().guid({ version: "uuidv4" }).required(),
      
      });
      let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
      console.log("-------",payload.id)
      let criteria = {
        id: payload.id,
      };
      let objToSave = {};
      if (_.has(payload, "name") && payload.name != "")
        objToSave.name = payload.name;
      if (_.has(payload, "Type") && payload.Type != "")
        objToSave.Type = payload.Type;
    console.log("yeee",JSON.stringify(objToSave));
    let user = await Services.adminAchievementServices.getAchievement(criteria);
    console.log(JSON.stringify(user));
    let projection = [...adminAchievementProjection]; 
    if(user){
    let updateData = Services.adminAchievementServices.updateAchievement(criteria,
      objToSave,projection
    );
    if (updateData) {
      return message.success.UPDATED;
    } else {
      throw Response.error_msg.implementationError;
    }
}
else {
    throw Response.error_msg.implementationError;
  }
  },
  
  deleteAchievement: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(paramData, schema);

    let criteria = {
      id: payload.id,
    };
    let deleteData = Services.adminAchievementServices.deleteAchievement(
      criteria
    );
    if (deleteData) {
      return message.success.DELETED;
    } else {
      throw Response.error_msg.implementationError;
    }
  },
  getAchievementDetail: async (payloadData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let criteria = {
      id: payload.id,
    };
    let AchievementDetail = Services.adminAchievementServices.getAchievement(
      criteria,
      adminAchievementProjection,
      true
    );
    if (AchievementDetail) {
      return AchievementDetail;
    } else {
      throw Response.error_msg.recordNotFound;
    }
  },

};