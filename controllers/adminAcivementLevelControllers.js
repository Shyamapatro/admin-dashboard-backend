const _ = require("underscore");
const Joi = require("joi");
const Response = require("../config/response");
let commonHelper = require("../Helper/common");
const moment = require("moment");
let config = require("../config/env")();
let message = require("../config/messages");
const Services = require("../services");
adminAchievementLevelProjection=["name","id","type","createdAt","updatedAt"]
module.exports = {
  AddAchievementLevel: async (payloadData) => {
    const schema = Joi.object().keys({
      name: Joi.string().optional(),
      Type: Joi.string().optional(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let objToSave = {};
    if (_.has(payload, "name") && payload.name != "")
      objToSave.name = payload.name;
    if (_.has(payload, "Type") && payload.Type != "")
      objToSave.Type = payload.Type;
    objToSave.CreateAt = moment(new Date(Date.now())).format("YYYY-MM-DD");
    let AchievementLevelData = await Services.adminAchievementLevelServices.addAchievementLevel(
      objToSave,
      
    );
    if (AchievementLevelData) {
      return message.success.ADDED;
    } else {
      throw Response.error_msg.InvalidData;
    }
  },
  editAchievementLevel: async (payloadData) => {
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
    let user = await Services.adminAchivementLevelServices.getAchievementLevel(criteria);
    console.log(JSON.stringify(user));
    let projection = [...adminAchievementLevelProjection]; 
    if(user){
    let updateData = Services.adminAchivementLevelServices.updateAchievementLevel(criteria,
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
  deleteAchievementLevel: async (paramData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(paramData, schema);

    let criteria = {
      id: payload.id,
    };
    let deleteData = Services.adminAchivementLevelServices.deleteAchievementLevel(
      criteria
    );
    if (deleteData) {
      return message.success.DELETED;
    } else {
      throw Response.error_msg.implementationError;
    }
  },
  getAchievementLevelDetail: async (payloadData) => {
    const schema = Joi.object().keys({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
    });
    let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    let criteria = {
      id: payload.id,
    };
    let AchievementLevelDetail = Services.adminAchivementLevelServices.getAchievementLevel(
      criteria,
      adminAchievementLevelProjection,
      true
    );
    if (AchievementLevelDetail) {
      return AchievementLevelDetail;
    } else {
      throw Response.error_msg.recordNotFound;
    }
  }
 
};